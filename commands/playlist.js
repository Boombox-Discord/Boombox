"use strict";
const Discord = require("discord.js");
const { getRedis, clientRedis } = require("../utils/redis");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "playlist",
  description:
    "Plays all songs from a youtube playlist, spotify album or spotify playlist.",
  args: true,
  usage: "<youtube URL, spotify album or playlist URL>",
  guildOnly: true,
  voice: true,
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription(
      "Plays all songs from a youtube playlist, spotify album or spotify playlist."
    )
    .addStringOption((option) =>
      option
        .setName("playlisturl")
        .setDescription("Youtube URL, spotify album or playlist URL.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const manager = interaction.client.manager;
    const voiceChannel = interaction.member.voice.channel;

    const permissions = voiceChannel.permissionsFor(interaction.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.editReply(
        "I don't have permission to join or speak in that voice channel!"
      );
    }

    const mediaName = interaction.options.get("playlisturl").value;

    if (!mediaName.startsWith("https://")) {
      return interaction.editReply(
        "You did not supply a link to a youtube playlist!"
      );
    }

    const searchEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("🔍 Searching For Video")
      .setAuthor(
        interaction.client.user.username,
        interaction.client.user.avatarURL()
      )
      .setDescription("Please wait we are searching for that playlist.");
    interaction.editReply({ embeds: [searchEmbed] });

    const response = await manager.search(mediaName);
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

    // by defualt set the for loop for playlist to zero so we start at the start of the playlist
    let forNumb = 0;

    await getRedis(`guild_${interaction.guildId}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      let serverQueue = JSON.parse(reply);

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
        `guild_${interaction.guildId}`,
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
          interaction.client.user.username,
          interaction.client.user.avatarURL()
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

      return interaction.editReply({ embeds: [playlistEmbed] });
    });
  },
};
