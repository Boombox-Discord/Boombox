import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandInteraction } from "../types/Command.js";

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
        );

    execute = async (interaction: CommandInteraction): Promise<void> => {
        const player = this.client.manager.get(interaction.guildId);

        if (!player) {
            interaction.editReply("There is currently no song playing!");
            return;
        }

        interaction.editReply("I have skipped to the next song!");

        player.stop();
        return;
    }
}