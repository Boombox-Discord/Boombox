"use strict";
const Discord = require("discord.js");
const { clientRedis } = require("../utils/redis");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "play",
  description: "Plays a song from youtube, spotify or any MP3 url.",
  args: true,
  usage: "<youtube URL, video name or spotify URL>",
  guildOnly: true,
  voice: true,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from youtube, spotify or any MP3 url.")
    .addStringOption((option) =>
      option
        .setName("songname")
        .setDescription("Youtube URL, video name or Spotify URL.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const manager = interaction.client.manager;
    const voiceChannel = interaction.member.voice.channel;

    const permissions = voiceChannel.permissionsFor(interaction.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.reply(
        "I don't have permission to join or speak in that voice channel!"
      );
    }

    let video = "";
    let query = "";

    const mediaName = interaction.options.get("songname").value;

    if (mediaName.startsWith("https://")) {
      video = mediaName;
      query = mediaName;
    } else {
      query = `ytsearch:${mediaName}`;
      video = mediaName;
    }

    const searchEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("🔍 Searching For Video")
      .setAuthor(
        interaction.client.user.username,
        interaction.client.user.avatarURL()
      )
      .setDescription(
        `Please wait we are searching for a song called ${video}`
      );
    await interaction.editReply({ embeds: [searchEmbed] });

    const response = await manager.search(query);
    if (!response) {
      return interaction.editReply(
        "Sorry, an error has occurred, please try again later!"
      );
    }
    if (!response.tracks[0]) {
      return interaction.editReply("Sorry, there were no songs found!");
    }
    if (response.tracks[0].isStream) {
      return interaction.editReply("Sorry, that video is a livestream!");
    }

    const songQueue = {
      title: response.tracks[0].title,
      url: response.tracks[0].uri,
      thumbnail: response.tracks[0].thumbnail,
    };

    const redisReply = await clientRedis.get(`guild_${interaction.guildId}`);
    let serverQueue = JSON.parse(redisReply);

    if (!serverQueue) {
      const player = manager.create({
        guild: interaction.guildId,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channelId,
      });

      player.connect();

      serverQueue = {
        textChannel: interaction.channel,
        voiceChannel: voiceChannel, //skipcq: JS-0240
        songs: [],
      };
      serverQueue.songs.push(songQueue);
      await clientRedis.set(
        `guild_${interaction.guildId}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );
      player.play(response.tracks[0]);
    } else {
      serverQueue.songs.push(songQueue);
      clientRedis.set(
        `guild_${interaction.guildId}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );

      const addQueueEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle(songQueue.title)
        .setURL(songQueue.url)
        .setAuthor(
          interaction.client.user.username,
          interaction.client.user.avatarURL()
        )
        .setDescription(
          `[${songQueue.title}](${songQueue.url}) has been added to the queue and is number ${serverQueue.songs.length} in the queue!`
        )
        .setThumbnail(songQueue.thumbnail);

      return interaction.editReply({ embeds: [addQueueEmbed] });
    }
  },
};
