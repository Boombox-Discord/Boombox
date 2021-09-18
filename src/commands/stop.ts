import { clientRedis } from "../utils/redis";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Command } from "../types/Command";

export default class Stop extends Command {
    name = "stop"
    description =
        "Stop's the currnet playing song and deletes the queue."
    args = false
    usage = null
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)

    execute = async (interaction: CommandInteraction) => {
        const manager = interaction.client.manager;

        const player = manager.get(interaction.guildId);

        if (!player) {
            return interaction.editReply("There is currently no song playing!");
        }

        const redisReply = await clientRedis.get(`guild_${interaction.guildId}`);

        const serverQueue = JSON.parse(redisReply);

        serverQueue.songs = [];
        clientRedis.set(
            `guild_${interaction.guildId}`,
            JSON.stringify(serverQueue)
        );

        interaction.editReply("I removed all songs from the queue!");

        return player.stop();
    }
}