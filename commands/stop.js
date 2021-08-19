"use strict";
const { clientRedis, getRedis } = require("../utils/redis");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: "stop",
  description: "Stop's the currnet playing song and deletes the queue.",
  args: false,
  guildOnly: true,
  voice: true,
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription("Stop's the currnet playing song and deletes the queue."),
  async execute(interaction) {
    const manager = interaction.client.manager;

    const player = manager.get(interaction.guildId);

    if (!player) {
      return interaction.reply("There is currently no song playing!");
    }

    await getRedis(`guild_${interaction.guildId}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      const serverQueue = JSON.parse(reply);

      serverQueue.songs = [];
      clientRedis.set(
        `guild_${interaction.guildId}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );
    });

    interaction.reply("I removed all songs from the queue!");

    return player.stop();
  },
};
