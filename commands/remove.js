const { getRedis, clientRedis } = require("../utils/redis");
const Discord = require("discord.js");

module.exports = {
  name: "remove",
  description: "Removes a specifc song from the queue",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;
    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently no songs in the queue!");
    }

    let serverQueue;

    await getRedis(`guild_${message.guild.id}`, async function (err, reply) {
      if (err) {
        throw new Error("Error with Redis");
      }
      serverQueue = JSON.parse(reply);

      if (args[0] == 1) {
        return message.reply("I cannot remove the current song playing.");
      }

      if (args[0] > serverQueue.songs.length || args[0] < 0) {
        return message.reply(
          `The queue is only ${serverQueue.songs.length} songs long!`
        );
      }

      if (isNaN(args[0])) {
        return message.channel.send("That is not a valid number!");
      }

      const argsNum = parseInt(args[0]);
      const deletedSong = serverQueue.songs[argsNum - 1].title;

      serverQueue.songs.splice(argsNum - 1, 1);

      clientRedis.set(
        `guild_${message.guild.id}`,
        JSON.stringify(serverQueue),
        "EX",
        86400
      );

      const replyEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle(`${deletedSong} Has Been Removed From The Queue!`)
        .setAuthor(
          message.client.user.ussername,
          message.client.user.avatarURL()
        );

      return message.channel.send(replyEmbed);
    });
  },
};
