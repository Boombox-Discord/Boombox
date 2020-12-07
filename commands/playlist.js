const play = require("./playSong");
const { Metrics, clientRedis } = require("../utils/utils");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const searchSong = require("genius-lyrics-api/lib/searchSong");
const playlistQueue = require("./playlistQueue");

const { youtubeApi, geniusApiKey } = require("../config.json");

async function playlist(msg, serverQueue, player, client) {
  Metrics.increment("boombox.playlist");

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

  const args = msg.content.split("&list=");

  msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: "🔍 Searching...",
      color: 16711680,
      description: `Please wait, we are adding all songs from that playlist into the queue. This can take awhile depending on how many songs are in the playlist.`,
    },
  });

  const urlGet =
    "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=1000&playlistId=" +
    args[1] +
    "&key=" +
    youtubeApi;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = async function () {
    if ((this.readyState === 4) & (this.status === 200)) {
      var str = this.responseText;
      var parse = JSON.parse(str);
      var videoID = parse.items[0].snippet.resourceId.videoId;
      var imgURL = parse.items[0].snippet.thumbnails.high.url;
      var videoTitle = parse.items[0].snippet.title;
      var videoURL = "https://www.youtube.com/watch?v=" + videoID;

      var optionsSong = {
        apiKey: geniusApiKey,
        title: videoTitle,
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
          player: player,
          songs: [],
          volume: 5,
          playing: true,
        };

        queueContruct.songs.push(song);
        clientRedis.set(
          `guild_${msg.guild.id}`,
          JSON.stringify(queueContruct),
          "EX",
          86400
        );
        await play(
          msg.guild,
          queueContruct.songs[0],
          "playlist",
          parse,
          msg,
          player,
          client
        );
      } else {
        playlistQueue(msg, serverQueue, parse, client);
      }
    }
  };
  xmlhttp.open("GET", urlGet, true);

  xmlhttp.send();
}

module.exports = playlist;
