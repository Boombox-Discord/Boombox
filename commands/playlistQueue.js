const { clientRedis } = require("../utils/utils");
const searchSong = require("genius-lyrics-api/lib/searchSong");

const { geniusApiKey } = require("../config.json"); //skipcq: JS-0266

async function playlistQueue(msg, serverQueue, parse, client) {
  var songNumber;
  for (var i = 1; i < parse.items.length; i++) {
    var videoID = parse.items[i].snippet.resourceId.videoId;
    var imgURL = parse.items[i].snippet.thumbnails.high.url;
    var videoTitle = parse.items[i].snippet.title;
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

    const song = {
      title: videoTitle,
      url: videoURL,
      imgurl: imgURL,
      geniusURL: geniusSong[0].url,
    };

    songNumber += 1;

    serverQueue.songs.push(song);
    clientRedis.set(
      `guild_${msg.guild.id}`,
      JSON.stringify(serverQueue),
      "EX",
      86400
    );
  }
  msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: "✅ Done",
      color: 16711680,
      description: `We have added all ${parse.items.length} songs from this playlist to the queue!`,
    },
  });

  // return queuemsg(msg, serverQueue);
}

module.exports = playlistQueue;
