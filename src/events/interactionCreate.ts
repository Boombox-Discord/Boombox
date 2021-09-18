import * as Sentry from '@sentry/node';
import {
  GuildMember,
  Interaction,
} from 'discord.js';

import { Event } from '../types/Event';
import { CommandInteraction } from '../types/Command';
export default class InteractionCreate extends Event {
  run = async (args: Interaction[]): Promise<void> => {
    const [interaction] = args;
    if (!interaction.isCommand()) {
      return;
    }
    const commandInteraction = interaction as CommandInteraction;
    const { commandName } = commandInteraction;
    const command = this.client.commands.get(commandName);
    interaction.member = interaction.member as GuildMember;

    if (command.guildOnly && !interaction.member.guild) {
      interaction.reply('You must be in a guild to use this command.');
      return;
    }
    if (command.voice && !interaction.member.voice.channel) {
      interaction.reply('You must be in a voice channel to use this command.');
      return;
    }

    const transaction = Sentry.startTransaction({
      op: 'command',
      name: 'Command ran on Boombox',
    });

    try {
      command.execute(commandInteraction);
    } catch (error) {
      interaction.reply(
        'It looks like I encountered an error, it has been reported and will be fixed soon.'
      );
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  };
}
