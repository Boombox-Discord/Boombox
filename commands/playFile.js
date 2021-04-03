const play = require("./playSong");
const { Metrics, clientRedis } = require("../utils/utils");
const searchSong = require("genius-lyrics-api/lib/searchSong");

const { geniusApiKey } = require("../config.json");

async function executefile(msg, serverQueue, player, client) {
  Metrics.increment("boombox.playfile");

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

  const files = (msg.attachments).array();
  const file = files[0];

  if (!file) {
    return msg.channel.send("You need to attach a MP3 file to play!")
  }

  if (file.length == 0) {
    return msg.channel.send("You need to attach a MP3 file to play!")
  }


  const splitName = file.name.split(".");
    const fileEx = splitName[splitName.length-1];
    if (!fileEx === "mp3") {
      return msg.channel.send("That is not an MP3 file! Boombox currently only supports MP3 files.")
    }

  msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL(),
      },
      title: "🔍 Loading...",
      color: 16711680,
      description: `Please wait, we are loading the file.`,
    },
  });

  const searchQuery = file.url;
  const results = await player.manager.search(searchQuery);
  const { track, info } = results.tracks[0];
  //Play songa

  const song = {
    title: info.title,
    url: null,
    imgurl: null,
    geniusURL: null,
    track: track,
    info: info,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connected: false,
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

module.exports = executefile;
