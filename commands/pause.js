"use strict";
const Discord = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause or resume the current song.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;
    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently no songs playing!");
    }

    if (player.paused) {
      player.pause(false);
      const messageEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle("⏸️ I have resumed the media!")
        .setAuthor(
          message.client.user.username,
          message.client.user.avatarURL()
        );
      return message.channel.send(messageEmbed);
    }
    player.pause(true);
    const messageEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("⏸️ I have paused the media!")
      .setAuthor(
        message.client.user.username,
        message.client.user.avatarURL()
      );
    return message.channel.send(messageEmbed);
  },
};
