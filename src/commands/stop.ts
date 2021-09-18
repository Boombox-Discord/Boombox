import { SlashCommandBuilder } from '@discordjs/builders';

import { Command, CommandInteraction } from "../types/Command";
import { clientRedis } from '../utils/redis';

export default class Stop extends Command {
  name = 'stop';

  description = "Stop's the currnet playing song and deletes the queue.";

  args = false;

  usage = null;

  guildOnly = true;

  voice = true;

  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  execute = async (interaction: CommandInteraction): Promise<void> => {
    const { manager } = interaction.client;

    const player = manager.get(interaction.guildId);

    if (!player) {
      interaction.editReply('There is currently no song playing!');
      return;
    }

    const redisReply = await clientRedis.get(`guild_${interaction.guildId}`);

    const serverQueue = JSON.parse(redisReply);

    serverQueue.songs = [];
    clientRedis.set(
      `guild_${interaction.guildId}`,
      JSON.stringify(serverQueue)
    );

    interaction.editReply('I removed all songs from the queue!');

    player.stop();
    return;
  };
}
