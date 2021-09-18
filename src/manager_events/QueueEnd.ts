import { TextChannel } from 'discord.js';
import { Player } from 'erela.js';
import { Event } from '../types/Event';
import { clientRedis } from '../utils/redis';
import { TrackUtils } from 'erela.js';



export default class QueueEnd extends Event {
    run = async (player: Player): Promise<void> => {
        const redisReply = await clientRedis.get(`guild_${player.guild}`);
        const serverQueue = JSON.parse(redisReply);
        const channel = this.client.channels.cache.get(player.textChannel) as TextChannel;
        let sendMessage = true;
        if (!player.textChannel || !channel || !this.client.hasPermissionsSend(channel)
        ) {
            sendMessage = false;
        }

        serverQueue.songs.shift();

        if (!serverQueue.songs[0]) {
            await clientRedis.del(`guild_${player.guild}`);
            if (sendMessage) {
                channel.send('No more songs in queue, leaving voice channel!');
            }

            return player.destroy();
        }
        await clientRedis.set(
            `guild_${player.guild}`,
            JSON.stringify(serverQueue)
        );
        // check for spotify tracks played from /playlist command
        if (!serverQueue.songs[0].url) {
            const unersolvedTrack = TrackUtils.buildUnresolved({
                title: serverQueue.songs[0].title,
                author: serverQueue.songs[0].author,
                duration: serverQueue.songs[0].duration,
            });
            return player.play(unersolvedTrack);
        }
        const response = await this.client.manager.search(serverQueue.songs[0].url);
        player.play(response.tracks[0]);
    }
}