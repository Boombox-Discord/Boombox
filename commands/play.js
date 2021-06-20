const Discord = require('discord.js');
const clientRedis = require('../utils/redis');

module.exports = {
	name: 'play',
	description: 'Plays a song from youtube.',
    args: true,
    usage: '<youtube URL or video name>',
	guildOnly: true,
	async execute(message, args) {
		const manager = message.client.manager;
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.reply('You need to be in a voice channel to request music!');
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			message.reply("I don't have permission to join or speak in that voice channel!");
		}

		clientRedis.get(voiceChannel.id, function(err, result) {
			if (err) { throw err; }
		})

		var video = "";
		var query = ""

		if (args[0].startsWith("https://")){
			video = args[0];
			query = args[0];
		} else {
			for (i = 0; i < args.length; i++) {
				video += args[i] + " ";
			}
			query = `ytsearch:${video}`
		}
		
		const searchEmbed = new Discord.MessageEmbed()
			.setColor('#ed1c24')
			.setTitle('🔍 Searching For Video')
			.setAuthor(message.client.user.username, message.client.user.avatarURL())
			.setDescription(`Please wait we are searching for a song called ${video}`)
		message.channel.send(searchEmbed);

		const response = await manager.search(query);
		if (!response[1].isStream) {
			return message.reply("Sorry, that video is a livestream!");
		}
	},
};