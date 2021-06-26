"use strict";
const { clientRedis, getRedis } = require("../utils/redis");

module.exports = {
  name: "stop",
  description: "Stop's the currnet playing song and deletes the queue.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;

    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently no song playing!");
    }

    await getRedis(`guild_${message.guild.id}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      const serverQueue = JSON.parse(reply);

      serverQueue.songs = [];
      clientRedis.set(
        `guild_${message.guild.id}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );
    });

    player.stop();
  },
};
