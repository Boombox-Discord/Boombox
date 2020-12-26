const play = require("./playSong");
const { Metrics, clientRedis } = require("../utils/utils");
const searchSong = require("genius-lyrics-api/lib/searchSong");

const { geniusApiKey } = require("../config.json");

async function execute(msg, serverQueue, player, client) {
  Metrics.increment("boombox.play");

  const args = msg.content.split(" ");

  const voiceChannel = msg.member.voice.channel;
  if (!voiceChannel) {
    return msg.channel.send("You need to be in a voice channel to play music!");
  }
  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return msg.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  var argsSlice = args.slice(1, -1);
  var i;
  var video = "";
  for (i = 0; i < argsSlice.length; i++) {
    video += argsSlice[i] + " ";
  }

  video += args[args.length - 1];

  console.log(video);

  msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL(),
      },
      title: "🔍 Searching...",
      color: 16711680,
      description: `Please wait, we are searching YouTube for a song called ${video}.`,
    },
  });

  const searchQuery = `ytsearch:${video}`;
  const results = await player.manager.search(searchQuery);
  const { track, info } = results.tracks[0];

  if (info.isStream) {
    return msg.channel.send(
      "Sorry that is a live video. Please try a video that is not live."
    );
  }

  console.log(info);

  var optionsSong = {
    apiKey: geniusApiKey,
    title: video,
    artist: "",
    optimizeQuery: true,
  };
  var geniusSong = await searchSong(optionsSong);

  if (geniusSong === null) {
    geniusSong = [
      {
        url: "Nothing found.",
      },
    ];
  }
  //Play song

  const song = {
    title: info.title,
    url: info.url,
    imgurl: `https://i.ytimg.com/vi/${info.identifier}/hqdefault.jpg`,
    geniusURL: geniusSong[0].url,
    track: track,
    info: info,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      songs: [],
      playing: true,
    };
    queueContruct.songs.push(song);
    clientRedis.set(
      `guild_${msg.guild.id}`,
      JSON.stringify(queueContruct),
      "EX",
      86400
    );

    try {
      play(msg.guild, queueContruct.songs[0], null, null, msg, player, client);
    } catch (err) {
      clientRedis.del(`guild_${msg.guild.id}`);
      return msg.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    clientRedis.set(
      `guild_${msg.guild.id}`,
      JSON.stringify(serverQueue),
      "EX",
      86400
    );
    return msg.channel.send({
      embed: {
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL(),
        },
        title: song.title,
        url: song.url,
        color: 16711680,
        description: `${song.title} has been added to queue!`,
        thumbnail: {
          url: song.imgurl,
        },
      },
    });
  }
}

module.exports = execute;
