"use strict";
const Discord = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause or resume the current song.",
  args: false,
  guildOnly: true,
  voice: true,
  execute(interaction) {
    const manager = interaction.client.manager;
    const player = manager.get(interaction.guildID);

    if (!player) {
      return interaction.reply("There is currently no songs playing!");
    }

    if (player.paused) {
      player.pause(false);
      const messageEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle("⏸️ I have resumed the media!")
        .setAuthor(
          interaction.client.user.username,
          interaction.client.user.avatarURL()
        );
      return interaction.reply({ embeds: [messageEmbed] });
    }
    player.pause(true);
    const messageEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("⏸️ I have paused the media!")
      .setAuthor(
        interaction.client.user.username,
        interaction.client.user.avatarURL()
      );
    return interaction.reply({ embeds: [messageEmbed] });
  },
};
