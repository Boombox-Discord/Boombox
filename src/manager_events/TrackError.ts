import { TextChannel } from 'discord.js';
import { Event } from '../types/Event';
import { Player, Track, TrackExceptionEvent } from 'erela.js';

export default class TrackError extends Event {
    run = async (player: Player, track: Track, event: TrackExceptionEvent): Promise<void> => {
        const channel = this.client.channels.cache.get(player.textChannel) as TextChannel;
        let sendMessage = true;
        if (!player.textChannel || !channel || !this.client.hasPermissionsSend(channel)) {
            sendMessage = false;
        }

        player.stop();
        if (sendMessage) {
            channel.send(`There was an error playing ${track.title} so I skipped to the next song. This error has been recoreded and should be fixed soon.`);
            return;
        }
        return;
    }
}