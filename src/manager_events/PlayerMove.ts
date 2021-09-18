import { Player } from 'erela.js';
import { Event } from '../types/Event';

export default class PlayerMove extends Event {
    run = async (player: Player, oldChannel: string, newChannel: string): Promise<void> => {
        if (!newChannel) {
            await this.client.redis.del(`guild_${player.guild}`);
            return player.destroy();
        }
        const { position } = player;
        player.setVoiceChannel(newChannel);
        await player.play(player.queue.current);
        player.seek(position);
    }
}