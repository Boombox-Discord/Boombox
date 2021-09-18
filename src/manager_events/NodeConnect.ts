import { Node, TrackUtils } from 'erela.js';
import { Event } from '../types/Event';
import redisScan from 'node-redis-scan';
import { clientRedis, clientRedisNoAsync } from '../utils/redis';


export default class NodeConnect extends Event {
    run = async (node: Node): Promise<void> => {
        console.log(`Node ${node.options.identifier} connected`); // skipcq: JS-0002

        // go through redis and check if theer are any queues that need playing if the bot has crashed.
        const scanner = new redisScan(clientRedisNoAsync);
        scanner.eachScan(
            'guild_*',
            async (matchingKeys) => {
                // Depending on the pattern being scanned for, many or most calls to
                // this function will be passed an empty array.
                if (matchingKeys.length) {
                    // Matching keys found after this iteration of the SCAN command.
                    for (let i = 0; i < matchingKeys.length; i++) {
                        const redisQueue = await clientRedis.get(matchingKeys[i]);
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
                }
            },
            (err, matchCount) => {
                if (err) throw err;

                // matchCount will be an integer count of how many total keys
                // were found and passed to the intermediate callback.
                console.log(`Found ${matchCount} keys.`);
            }
        );
    };
}
