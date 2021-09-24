import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction } from '../types/Command';

export default class Settings extends Command {
    name: 'settings';

    description: 'Change Boombox Settings.';

    usage: '[setting] [value]';

    args = true;

    guildOnly = true;

    voice = false;

    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('role')
                .setDescription('Set a role that a person will require to use the bot.')
                .addMentionableOption((option) =>
                    option
                        .setName('role')
                        .setDescription('e.g @DJ')
                        .setRequired(true)
                )
        )
}