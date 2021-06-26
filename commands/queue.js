"use strict";
const Discord = require("discord.js");
const { getRedis } = require("../utils/redis");
const DiscordPages = require("discord-pages");

module.exports = {
  name: "queue",
  description: "Shows the current queue",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    await getRedis(`guild_${message.guild.id}`, function (err, reply) {
      if (err) {
        throw new Error("Error with Redis");
      }
      const serverQueue = JSON.parse(reply);

      if (!serverQueue) {
        return message.reply("There is currently no songs in the queue!");
      }
      const size = 10;
      const songsArray = [];
      //split array into groups of 10
      for (let i = 0; i < serverQueue.songs.length; i += size) {
        songsArray.push(serverQueue.songs.slice(i, i + size));
      }

      let songCount = 0;
      let embedDesc = "";
      const embedPagesArray = [];

      for (let i = 0; i < songsArray.length; i++) {
        const songEmbed = new Discord.MessageEmbed()
          .setColor("#ed1c24")
          .setTitle("Currnet Songs In The Queue")
          .setAuthor(
            message.client.user.username,
            message.client.user.avatarURL()
          )
          .setThumbnail(serverQueue.songs[0].thumbnail);

        for (let j = 0; j < songsArray[i].length; j++) {
          songCount++;
          embedDesc += `${songCount}. ${songsArray[i][j].title} \n`;
        }
        songEmbed.setDescription(embedDesc);
        embedDesc = "";
        embedPagesArray.push(songEmbed);
      }
      const embedPages = new DiscordPages({
        pages: embedPagesArray,
        channel: message.channel,
      });

      embedPages.createPages();
    });
  },
};
