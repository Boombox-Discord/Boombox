import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class Pong extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName('pong')
            .setDescription('Sends ping in chat');
        registry.registerChatInputCommand(builder)
    }

    public async chatInputRun(interaction: CommandInteraction) {
        return interaction.reply(`Ping: ${Math.round(this.container.client.ws.ping)}`)
    }
}