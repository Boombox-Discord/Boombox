"use strict";
const Discord = require("discord.js");

module.exports = {
  name: "volume",
  description: "Set's the volume to a number between 0 and 100.",
  args: true,
  usage: "<number 0 to 100>",
  guildOnly: true,
  voice: true,
  execute(message, args) {
    const manager = message.client.manager;
    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently no songs playing!");
    }

    if (args[0] >= 101 || args[1] <= 0) {
      return message.reply("Please select a number between 1 and 100!");
    }

    if (isNaN(args[0])) {
      return message.channel.send("That is not a valid number!");
    }

    player.setVolume(args[0]);
    const embed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle(`🔊 I have set the volume to ${args[0]}%`)
      .setAuthor(message.client.user.username, message.client.user.avatarURL());

    return message.channel.send(embed);
  },
};
