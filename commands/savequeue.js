"use strict";
const { getRedis, clientRedis } = require("../utils/redis");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "savequeue",
  description: "Saves the current queue, or loads a saved queue.",
  args: true,
  usage: "<save | load | list> <queue ID>",
  data: new SlashCommandBuilder()
    .setName("savequeue")
    .setDescription("Saves the current queue, or loads a saved queue.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("save")
        .setDescription("Saves the current queue.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name you would like to save the queue as.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("load")
        .setDescription("Loads a queue from the saved queues.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the queue you would like loaded.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Lists all your saved queues.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a saved queue")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the saved queue you would like to delete.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "save") {
        const queueName = interaction.options.getString("name")
        let userQueues = []
        await getRedis(`guild_${interaction.guildId}`, async function (err, reply) {
            if (err) {
            throw new Error("Error with Redis");
            }
            const serverQueue = JSON.parse(reply);

            if (!serverQueue) {
                return interaction.reply(
                    "There is currently no songs in the queue to save!"
                );
            }

            await getRedis(`save_${interaction.user.id}`, async function (err, reply) {
                if (err) {
                    throw new Error("Error with Redis");
                }
                
                if (reply) {
                    const redisSaveQueue = JSON.parse(reply)
                    for (let i = 0; i < redisSaveQueue.length; i++) {
                        return interaction.reply(`There is already a saved queue called ${queueName}! PLease choose a different name.`);
                    }
                    userQueues = JSON.parse(reply);
                }

                const queuePush = {
                    name: queueName,
                    songs: serverQueue.songs
                }
                userQueues.push(queuePush)
                clientRedis.set(
                    `save_${interaction.user.id}`,
                    JSON.stringify(userQueues)
                )
                const saveEmbed = new Discord.MessageEmbed()
                    .setColor("#ed1c24")
                    .setTitle(`💾  I have saved the current queue under the name ${queueName}!`)
                    .setAuthor(
                        interaction.client.user.username,
                        interaction.client.user.avatarURL()
                    )

                return interaction.reply({ embeds: [saveEmbed] })
            })
        })
    }
  },
};
