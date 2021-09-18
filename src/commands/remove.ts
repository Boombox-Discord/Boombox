import { clientRedis } from "../utils/redis";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandInteraction } from "../types/Command";
import { MessageEmbed } from "discord.js";

export default class Remove extends Command {
    name = "remove"
    description =
        "Removes a specifc song from the queue"
    args = true
    usage = null
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addIntegerOption((option) =>
            option
                .setName("songnumber")
                .setDescription("Song number in queue to remove.")
                .setRequired(true)
        )

    execute = async (interaction: CommandInteraction): Promise<void> => {
        const manager = interaction.client.manager;
        const player = manager.get(interaction.guildId);

        if (!player) {
            interaction.editReply("There is currently no songs in the queue!");
            return;
        }

        const redisReply = await clientRedis.get(`guild_${interaction.guildId}`);
        const serverQueue = JSON.parse(redisReply);

        const remove = interaction.options.get("songnumber").value as number;

        if (remove === 1) {
            interaction.editReply("I cannot remove the current song playing.");
            return;
        }

        if (remove > serverQueue.songs.length || remove < 0) {
            interaction.editReply(
                `The queue is only ${serverQueue.songs.length} songs long!`
            );
            return;
        }
        const deletedSong = serverQueue.songs[remove - 1].title;

        serverQueue.songs.splice(remove - 1, 1);

        await clientRedis.set(
            `guild_${interaction.guildId}`,
            JSON.stringify(serverQueue),
            "EX",
            86400
        );

        const replyEmbed = new MessageEmbed()
            .setColor("#ed1c24")
            .setTitle(`${deletedSong} Has Been Removed From The Queue!`)
            .setAuthor(
                interaction.client.user.username,
                interaction.client.user.avatarURL()
            );

        interaction.editReply({ embeds: [replyEmbed] });
        return;
    }
}
