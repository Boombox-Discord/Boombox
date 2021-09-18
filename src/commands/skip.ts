import { clientRedis } from "../utils/redis";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Command } from "../types/Command";

export default class Skip extends Command {
    name = "skip"
    description =
        "Skips the current playing song."
    args = false
    usage = null
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option.setName("time").setDescription("e.g 1m 30s").setRequired(true)
        ),

    execute = async (interaction: CommandInteraction) => {
        const player = manager.get(interaction.guildId);

        if (!player) {
            return interaction.editReply("There is currently no song playing!");
        }

        interaction.editReply("I have skipped to the next song!");

        return player.stop();
    }
}