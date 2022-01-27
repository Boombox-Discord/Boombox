import { LogLevel, SapphireClient } from '@sapphire/framework';
import { createClient } from 'redis';

import '@sapphire/plugin-logger/register';
import { redisIP, redisPort, redisUser, redisPassword } from './config.json';

const redisClient = createClient({ url: `redis://${redisUser}@${redisPassword}${redisIP}:${redisPort}` });

export type RedisClientType = typeof redisClient;

export class Client extends SapphireClient {
	redis: RedisClientType

	constructor() {
		super({
			shards: 'auto',
			logger: {
				level: LogLevel.Debug
			},
			intents: [
				'GUILDS',
        'GUILD_VOICE_STATES',
        'DIRECT_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
			]
		});
		this.redis = redisClient;
		(async () => {
			this.redis.on('error', (err) => this.logger.error(err));
			await this.redis.connect();
		})();
	}
}