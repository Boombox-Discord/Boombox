"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "skip",
  description: "Skips the current playing song.",
  args: false,
  guildOnly: true,
  voice: true,
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song."),
  execute(interaction) {
    const manager = interaction.client.manager;
    const player = manager.get(interaction.guildId);

    if (!player) {
      return interaction.reply("There is currently not song playing!");
    }

    interaction.reply("I have skipped to the next song!");

    return player.stop();
  },
};
