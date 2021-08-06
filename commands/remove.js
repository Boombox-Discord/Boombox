"use strict";
const { getRedis, clientRedis } = require("../utils/redis");
const Discord = require("discord.js");

module.exports = {
  name: "remove",
  description: "Removes a specifc song from the queue",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(interaction) {
    const manager = interaction.client.manager;
    const player = manager.get(interaction.guildId);

    if (!player) {
      return interaction.reply("There is currently no songs in the queue!");
    }

    await getRedis(`guild_${interaction.guildId}`, function (err, reply) {
      if (err) {
        throw new Error("Error with Redis");
      }
      const serverQueue = JSON.parse(reply);

      const remove = interaction.options.get("songnumber").value;

      if (remove === 1) {
        return interaction.reply("I cannot remove the current song playing.");
      }

      if (remove > serverQueue.songs.length || remove < 0) {
        return interaction.reply(
          `The queue is only ${serverQueue.songs.length} songs long!`
        );
      }
      const deletedSong = serverQueue.songs[remove - 1].title;

      serverQueue.songs.splice(remove - 1, 1);

      clientRedis.set(
        `guild_${interaction.guildId}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );

      const replyEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle(`${deletedSong} Has Been Removed From The Queue!`)
        .setAuthor(
          interaction.client.user.username,
          interaction.client.user.avatarURL()
        );

      return interaction.reply({ embeds: [replyEmbed] });
    });
  },
};
