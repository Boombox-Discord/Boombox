"use strict";
const Discord = require("discord.js");
const { clientRedis, getRedis } = require("../utils/redis");

module.exports = {
  name: "play",
  description: "Plays a song from youtube or uploaded file.",
  args: true,
  usage: "<youtube URL or video name>",
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

    let video = "";
    let query = "";

    const files = message.attachments.array();
    const file = files[0];

    if (file) {
      video = file.name;
      query = file.url;
    } else if (args[0].startsWith("https://")) {
      video = args[0];
      query = args[0];
    } else {
      for (let i = 0; i < args.length; i++) {
        video += `${args[i]}  `;
      }
      query = `ytsearch:${video}`;
    }

    const searchEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("🔍 Searching For Video")
      .setAuthor(message.client.user.username, message.client.user.avatarURL())
      .setDescription(
        `Please wait we are searching for a song called ${video}`
      );
    message.channel.send(searchEmbed);

    const response = await manager.search(query);
    if (response.tracks[0].isStream) {
      return message.reply("Sorry, that video is a livestream!");
    }
    let songQueue; //skipcq: JS-0119
    if (file) {
      songQueue = {
        title: file.name,
        url: response.tracks[0].uri,
        thumbnail: response.tracks[0].thumbnail,
      };
    } else {
      songQueue = {
        title: response.tracks[0].title,
        url: response.tracks[0].uri,
        thumbnail: response.tracks[0].thumbnail,
      };
    }

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
        clientRedis.set(
          `guild_${message.guild.id}`,
          JSON.stringify(serverQueue),
          "EX",
          86400 //skipcq: JS-0074
        );
        player.play(response.tracks[0]);
      } else {
        serverQueue.songs.push(songQueue);
        clientRedis.set(
          `guild_${message.guild.id}`,
          JSON.stringify(serverQueue),
          "EX",
          86400 //skipcq: JS-0074
        );

        const addQueueEmbed = new Discord.MessageEmbed()
          .setColor("#ed1c24")
          .setTitle(songQueue.title)
          .setURL(songQueue.url)
          .setAuthor(
            message.client.user.username,
            message.client.user.avatarURL()
          )
          .setDescription(
            `[${songQueue.title}](${songQueue.url}) has been added to the queue and is number ${serverQueue.songs.length} in the queue!`
          )
          .setThumbnail(songQueue.thumbnail);

        return message.channel.send(addQueueEmbed);
      }
    });
  },
};
