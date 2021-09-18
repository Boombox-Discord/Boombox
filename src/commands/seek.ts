import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandInteraction } from "../types/Command";
import { timestring, humanizeDuration } from "timestring"

export default class Seek extends Command {
    name = "seek"
    description =
        "Goes to a specific point in the song. e.g 1 minute 30 seconds."
    args = true
    usage = "<time e.g 1m 30s>"
    guildOnly = true
    voice = true

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option.setName("time").setDescription("e.g 1m 30s").setRequired(true)
        );

    execute = async (interaction: CommandInteraction): Promise<void> => {
        const manager = interaction.client.manager;
        const player = manager.get(interaction.guildId);
        if (!player) {
            interaction.editReply("There is currently no song playing!");
            return;
        }

        const time = interaction.options.get("time").value;
        try {
            const seekTime = timestring(time);
            const seekTimeMS = seekTime * 1000;

            const duration = player.queue.current.duration;
            if (seekTimeMS > duration) {
                interaction.editReply(
                    `The current song is only ${humanizeDuration(duration)}.`
                );
                return;
            }
            player.seek(seekTimeMS);

            interaction.editReply(
                `Ok I have skipped to ${humanizeDuration(seekTimeMS)}`
            );
        } catch {
            interaction.editReply(
                "Please format the time to skip to like this, 1m 30s."
            );
        }
    }
}