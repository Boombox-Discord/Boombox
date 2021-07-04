"use strict";
const { clientRedis, getRedis } = require("../utils/redis");

module.exports = {
  name: "stop",
  description: "Stop's the currnet playing song and deletes the queue.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(interaction) {
    const manager = interaction.client.manager;

    const player = manager.get(interaction.guildID);

    if (!player) {
      return interaction.reply("There is currently no song playing!");
    }

    await getRedis(`guild_${interaction.guildID}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      const serverQueue = JSON.parse(reply);

      serverQueue.songs = [];
      clientRedis.set(
        `guild_${interaction.guildID}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );
    });

    interaction.reply('I removed all songs from the queue!')

    return player.stop();
  },
};
