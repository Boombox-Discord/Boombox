"use strict";
const Discord = require("discord.js");
const { getRedis, clientRedis } = require("../utils/redis");

module.exports = {
  name: "playlist",
  description: "Plays all songs from a youtube playlist.",
  args: true,
  usage: "<youtube URL>",
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;
    const voiceChannel = message.member.voice.channel;

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.reply(
        "I don't have permission to join or speak in that voice channel!"
      );
    }

    if (!args[0].startsWith("https://")) {
      return message.reply("You did not supply a link to a youtube playlist!");
    }

    const searchEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("🔍 Searching For Video")
      .setAuthor(message.client.user.username, message.client.user.avatarURL())
      .setDescription("Please wait we are searching for that playlist.");
    message.channel.send(searchEmbed);

    const response = await manager.search(args[0]);
    if (!response) {
      return message.reply(
        "Sorry, an error has occurred, please try again later!"
      );
    }
    if (!response.tracks[0]) {
      return message.reply("Sorry, there were no songs found!");
    }
    if (response.tracks[0].isStream) {
      return message.reply("Sorry, that video is a livestream!");
    }

    const songQueue = {
      title: response.tracks[0].title,
      url: response.tracks[0].uri,
      thumbnail: response.tracks[0].thumbnail,
    };

    // by defualt set the for loop for playlist to zero so we start at the start of the playlist
    let forNumb = 0;

    await getRedis(`guild_${message.guild.id}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      let serverQueue = JSON.parse(reply);

      if (!serverQueue) {
        const player = manager.create({
          guild: message.guild.id,
          voiceChannel: voiceChannel.id,
          textChannel: message.channel.id,
        });
        player.connect();

        serverQueue = {
          textChannel: message.channel,
          voiceChannel: voiceChannel, //skipcq: JS-0240
          songs: [],
        };

        serverQueue.songs.push(songQueue);
        //play the first song
        player.play(response.tracks[0]);

        //There were no songs already in the queue so we have already added the first song skip that song in the for loop
        forNumb = 1;
      }

      let errorSongs = 0;

      for (let i = forNumb; i < response.tracks.length; i++) {
        if (response.tracks[0].isStream) {
          errorSongs++;
        }
        const songsAdd = {
          title: response.tracks[i].title,
          url: response.tracks[i].uri,
          thumbnail: response.tracks[i].thumbnail,
        };
        serverQueue.songs.push(songsAdd);
      }
      clientRedis.set(
        `guild_${message.guild.id}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );

      const playlistEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle(
          "I have added all the songs from that playlist into the queue."
        )
        .setAuthor(
          message.client.user.username,
          message.client.user.avatarURL()
        );
      if (errorSongs > 0) {
        playlistEmbed.setDescription(
          `I have added ${
            response.tracks.length - errorSongs
          } to the queue and had an erorr adding ${errorSongs}!`
        );
      } else {
        playlistEmbed.setDescription(
          `I have added ${response.tracks.length} to the queue!`
        );
      }

      return message.channel.send(playlistEmbed);
    });
  },
};
