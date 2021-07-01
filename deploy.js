const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const {
    prefix,
    token,
} = require("./config.json"); //skipcq: JS-0266

client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === `${prefix}deploy` && message.author.id === client.application?.owner.id) {
		const data = [
			{
				name: 'play',
				description: 'Plays a song from youtube.',
                options: [{
                    name: 'songname',
                    type: 'STRING',
                    description: 'The Youtube URL or media name.',
                    required: true,
                }],
			},
			{
				name: 'help',
				description: "List's all available commands and info for the commands.",
			},
            {
				name: 'invite',
				description: "Sends an invite link for the bot.",
			},
            {
				name: 'nowplaying',
				description: "Shows the media that is currently playing.",
			},
            {
				name: 'pause',
				description: "Pause or resume the current song.",
			},
            {
				name: 'playlist',
				description: "Plays all songs from a youtube playlist.",
                options: [{
                    name: 'playlisturl',
                    type: 'STRING',
                    description: 'Youtube URL to playlist',
                    required: true,
                }],
			},
            {
				name: 'queue',
				description: "Shows the current queue.",
			},
            {
				name: 'remove',
				description: "Removes a specifc song from the queue.",
			},
            {
				name: 'skip',
				description: "Skips the current playing song.",
			},
            {
				name: 'stop',
				description: "Stop's the currnet playing song and deletes the queue.",
			},
            {
				name: 'volume',
				description: "Set's the volume to a number between 0 and 100.",
                options: [{
                    name: 'volume',
                    type: 'INTEGER',
                    description: 'Volume',
                    required: true,
                }],
			},
		];

		const command = await client.application?.commands.set(data);
		console.log(command);
	}
});

client.login(token);