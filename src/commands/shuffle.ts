import { SlashCommandBuilder } from '@discordjs/builders';
import { TrackUtils } from 'erela.js';

import { Command, CommandInteraction } from "../types/Command";
import { clientRedis } from '../utils/redis';
import { shuffleArray } from '../utils/utils';

export default class Shuffle extends Command {
  name = 'shuffle';

  description = 'Shuffles the current queue.';

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

    if (serverQueue.songs.length === 1) {
      interaction.editReply(
        'The queue is only 1 song long! Please add some more songs first.'
      );
      return;
    }

    const ShuffledQueue = shuffleArray(serverQueue.songs);
    serverQueue.songs = ShuffledQueue;

    await clientRedis.set(
      `guild_${interaction.guildId}`,
      JSON.stringify(serverQueue)
    );
    interaction.editReply('Ok, all songs in the queue have been shuffled');
    const unersolvedTrack = TrackUtils.buildUnresolved({
      title: serverQueue.songs[0].title,
      author: serverQueue.songs[0].author,
      duration: serverQueue.songs[0].duration,
    });
    return player.play(unersolvedTrack);
  };
}
