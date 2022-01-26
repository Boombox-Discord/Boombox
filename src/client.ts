import { LogLevel, SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';

export class Client extends SapphireClient {
	constructor() {
		super({
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
	}
}