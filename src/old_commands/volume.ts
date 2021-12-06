import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command, CommandInteraction } from "../types/Command.js";

export default class Volume extends Command {
    name = "volume"
    description =
        "Set's the volume to a number between 0 and 100"
    args = true
    usage = "<number 0 to 100>"
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addIntegerOption((option) =>
            option.setName("volume").setDescription("Volume").setRequired(true)
        );

    execute = async (interaction: CommandInteraction): Promise<void> => {
        const manager = interaction.client.manager;
        const player = manager.get(interaction.guildId);

        const volume = interaction.options.get("volume").value as number;

        if (!player) {
            interaction.editReply("There is currently no songs playing!");
            return;
        }

        if (volume >= 101 || volume <= 0) {
            interaction.editReply("Please select a number between 1 and 100!");
            return;
        }

        player.setVolume(volume);
        const embed = new MessageEmbed()
            .setColor("#ed1c24")
            .setTitle(`🔊 I have set the volume to ${volume}%`)
            .setAuthor(
                interaction.client.user.username,
                interaction.client.user.avatarURL()
            );

        interaction.editReply({ embeds: [embed] });
        return;
    }
}