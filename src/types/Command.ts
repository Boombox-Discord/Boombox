import { Client } from "../client.js";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import {
    CommandInteraction as DiscordCommandInteraction,
    StageChannel,
    TextChannel,
    VoiceChannel,
} from "discord.js";

export interface CommandInteraction extends DiscordCommandInteraction {
    client: Client;
}

export abstract class Command {
    client: Client;
    abstract name: string;
    abstract description: string;
    abstract args: boolean;
    abstract usage: string;
    abstract guildOnly: boolean;
    abstract voice: boolean;
    abstract data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
    abstract execute: (interaction: CommandInteraction) => Promise<void>;

    public constructor(client: Client) {
        this.client = client;
    }

    /**
     * Check if the bot has permissions to play in the voice channel.
     * This is just a shortcut method to this.client.hasPermissionsJoin.
     *
     * @param voiceChannel the voice channel to join
     * @returns a string with the issue preventing the bot from connecting, else
     *          null if there are no issues
     */
    protected hasPermissionsJoin(voiceChannel: VoiceChannel | StageChannel): string {
        return this.client.hasPermissionsJoin(voiceChannel);
    }

    /**
     * 
     * Check if the bot has permissions to send a message in the channel.
     * This is just a shortcut method to this.client.hasPermissionsSend.
     * 
     * @param textChannel the text channel to send the message in
     * @returns a string with the issue preventing the bot from sending a message, else
     *          null if there are no issues
     */
    protected hasPermissionsSend(textChannel: TextChannel): string {
        return this.client.hasPermissionsSend(textChannel);
    }

}