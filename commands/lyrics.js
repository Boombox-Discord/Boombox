const searchSong = require("genius-lyrics-api/lib/searchSong");
const getLyrics = require("genius-lyrics-api/lib/getLyrics");
const { Metrics } = require("../utils/utils");
const Discord = require("discord.js");

const { prefix, geniusApiKey } = require("../config.json"); //skipcq: JS-0266

async function lyrics(msg, serverQueue, client) {
  Metrics.increment("boombox.lyrics");

  const args = msg.content.split(" ");

  var argsSlice = args.slice(1, -1);
  var i;
  var song = "";
  for (i = 0; i < argsSlice.length; i++) {
    song += argsSlice[i] + " ";
  }

  song += args[args.length - 1];

  if (song === `${prefix}lyrics`) {
    if (!msg.member.voice.channel) {
      return msg.channel.send(
        "You have to be in a voice channel to request the lyrics to the currently playing song."
      );
    }
    if (!serverQueue) {
      return msg.channel.send("There is currently no songs playing!");
    }

    var geniusURL = serverQueue.songs[0].geniusURL;

    if (geniusURL === "Nothing found.") {
      return msg.channel.send(
        "Sorry we couldn't find any lyrics for that song."
      );
    }

    var geniusLyrics = getLyrics(geniusURL).then((lyrics) => {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor(16711680)
        .setTitle(`Lyrics for ${serverQueue.songs[0].title}`)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter("Lyrics provided from Genius");

      var splitted = lyrics.split(/\n\s*\n/);

      splitted.forEach((capture, i) =>
        exampleEmbed.addField("\u200b", `${capture}`)
      );

      return msg.channel.send(exampleEmbed);
    });
  } else {
    msg.channel.send({
      embed: {
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL(),
        },
        title: "🔍 Searching...",
        color: 16711680,
        description: `Please wait, we are searching Genius for lyrics to ${song}.`,
      },
    });

    var optionsSong = {
      apiKey: geniusApiKey,
      title: song,
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

    geniusURL = geniusSong[0].url;

    if (geniusURL === "Nothing found.") {
      return msg.channel.send(
        "Sorry we couldn't find any lyrics for that song."
      );
    }

    var geniusLyrics = getLyrics(geniusURL).then((lyrics) => {
      // skipcq: JS-0128

      const lyricsEmbed = new Discord.MessageEmbed()
        .setColor(16711680)
        .setTitle(`Lyrics for ${geniusSong[0].title}`)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter("Lyrics provided from Genius");

      var splitted = lyrics.split(/\n\s*\n/);

      splitted.forEach((capture, i) =>
        lyricsEmbed.addField("\u200b", `${capture}`)
      );

      return msg.channel.send(lyricsEmbed);
    });
  }
}

module.exports = lyrics;
