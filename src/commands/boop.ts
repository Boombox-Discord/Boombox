import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

export class UwUCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		// Registering with the builder provided by the method
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription('Sends a uwu in chat')
		);
	}
	public chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('OwO');
	}
}