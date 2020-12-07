const play = require("./playSong");
const { Metrics, clientRedis } = require("../utils/utils");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const searchSong = require("genius-lyrics-api/lib/searchSong");

const { youtubeApi, geniusApiKey } = require("../config.json");

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

  const urlGet =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
    video +
    "&key=" +
    youtubeApi;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = async function () {
    if (this.readyState === 4 && this.status === 200) {
      //Use parse() method to convert JSON string to JSON object
      var str = this.responseText;
      var parse = JSON.parse(str);
      if (parse.pageInfo.totalResults === 0) {
        return msg.channel.send(
          "Sorry we couldn't find any songs called " +
            video +
            ". Please try again or paste a link to the youtube video."
        );
      }
      if (
        parse.items[0].snippet.liveBroadcastContent === "live" ||
        parse.items[0].snippet.liveBroadcastContent === "upcoming"
      ) {
        return msg.channel.send(
          "Sorry that is a live video. Please try a video that is not live."
        );
      }
      var videoID = parse.items[0].id.videoId;
      var imgURL = parse.items[0].snippet.thumbnails.high.url;
      var videoTitle = parse.items[0].snippet.title;
      const videoURL = "https://www.youtube.com/watch?v=" + videoID;

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
        title: videoTitle,
        url: videoURL,
        imgurl: imgURL,
        geniusURL: geniusSong[0].url,
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
          play(
            msg.guild,
            queueContruct.songs[0],
            null,
            null,
            msg,
            player,
            client
          );
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
            url: videoURL,
            color: 16711680,
            description: `${song.title} has been added to queue!`,
            thumbnail: {
              url: song.imgurl,
            },
          },
        });
      }
    }
  };
  xmlhttp.open("GET", urlGet, true);

  xmlhttp.send();
}

module.exports = execute;
