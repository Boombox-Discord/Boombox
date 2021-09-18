import { Node, TrackUtils } from 'erela.js';
import { Event } from '../types/Event';


export default class NodeConnect extends Event {
    run = async (node: Node): Promise<void> => {
        console.log(`Node ${node.options.identifier} connected`);
        const redis = this.client.redis;
        redis.scanIterator({
            TYPE: 'string', // `SCAN` only
            MATCH: 'guild_*',
        });
        for await (const key of redis.scanIterator()) {
            const redisQueue = await redis.get(key);
            const serverQueue = JSON.parse(redisQueue);
            if (this.client.manager.get(serverQueue.textChannel.guildId)) return;
            const node = this.client.manager.leastLoadNodes;
            const player = this.client.manager.create({
                guild: serverQueue.voiceChannel.guildId,
                voiceChannel: serverQueue.voiceChannel.id,
                textChannel: serverQueue.textChannel.channelId,
                selfDeafen: true,
                node: node[0],
            });
            player.connect();
            // check for spotify tracks played from /playlist command
            if (!serverQueue.songs[0].url) {
                const unersolvedTrack = TrackUtils.buildUnresolved({
                    title: serverQueue.songs[0].title,
                    author: serverQueue.songs[0].author,
                    duration: serverQueue.songs[0].duration,
                });
                return player.play(unersolvedTrack);
            }
            const response = await this.client.manager.search(
                serverQueue.songs[0].url
            );
            player.play(response.tracks[0]);

            await player.play(response.tracks[0]);
        }
    };
}
