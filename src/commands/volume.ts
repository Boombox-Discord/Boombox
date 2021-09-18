import { clientRedis } from "../utils/redis";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Command } from "../types/Command";

export default class Volume extends Command {
    name = "volume"
    description =
        "Set's the volume to a number between 0 and 100.
    args = true
    usage = "<number 0 to 100>"
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addIntegerOption((option) =>
            option.setName("volume").setDescription("Volume").setRequired(true)
        ),

    execute = async (interaction: CommandInteraction) => {
        const manager = interaction.client.manager;
        const player = manager.get(interaction.guildId);

        const volume = interaction.options.get("volume").value;

        if (!player) {
            return interaction.editReply("There is currently no songs playing!");
        }

        if (volume >= 101 || volume <= 0) {
            //skipcq: JS-0074
            return interaction.editReply("Please select a number between 1 and 100!");
        }

        player.setVolume(volume);
        const embed = new Discord.MessageEmbed()
            .setColor("#ed1c24")
            .setTitle(`🔊 I have set the volume to ${volume}%`)
            .setAuthor(
                interaction.client.user.username,
                interaction.client.user.avatarURL()
            );

        return interaction.editReply({ embeds: [embed] });
    }
}