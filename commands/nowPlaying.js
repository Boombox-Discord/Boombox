"use strict";
const Discord = require("discord.js");
const { getRedis } = require("../utils/redis");

module.exports = {
  name: "np",
  description: "Shows the media that is currently playing.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;
    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently no songs playing!");
    }


    await getRedis(`guild_${message.guild.id}`, async function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      const serverQueue = JSON.parse(reply);

      const npEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setAuthor(
          message.client.user.username,
          message.client.user.avatarURL()
        )
        .setTitle(`${serverQueue.songs[0].title} Is Now Playing!`)
        .setURL(serverQueue.songs[0].url)
        .setThumbnail(serverQueue.songs[0].thumbnail);

      return message.channel.send(npEmbed);
    });
  },
};
