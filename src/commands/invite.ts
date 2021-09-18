import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { inviteLink } from '../../config.json';
import { Command, CommandInteraction } from "../types/Command";

export default class Help extends Command {
  name: 'invite';

  description: 'Sends an invite link for the bot.';

  usage: 'invite';

  args = false;

  guildOnly = false;

  voice = false;

  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  execute = async (interaction: CommandInteraction): Promise<void> => {
    const embed = new MessageEmbed()
      .setColor('#ed1c24')
      .setAuthor(
        interaction.client.user.username,
        interaction.client.user.avatarURL()
      )
      .setTitle(
        `Click Here to Invite ${interaction.client.user.username} To Your Server!`
      )
      .setURL(inviteLink);
    interaction.editReply({ embeds: [embed] });
  };
}
