const Discord = require('discord.js');
const {clientRedis, getRedis} = require('../utils/redis');

module.exports = {
	name: 'play',
	description: 'Plays a song from youtube.',
    args: true,
    usage: '<youtube URL or video name>',
	guildOnly: true,
	voice: true,
	async execute(message, args) {
		const manager = message.client.manager;
		const voiceChannel = message.member.voice.channel;

		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			message.reply("I don't have permission to join or speak in that voice channel!");
		}


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
		if (response.tracks[0].isStream) {
			return message.reply("Sorry, that video is a livestream!");
		}
		const songQueue = {
			title: response.tracks[0].title,
			url: response.tracks[0].uri,
			thumbnail: response.tracks[0].thumbnail,
		}

		await getRedis(`guild_${message.guild.id}`, async function (err, reply) {
			if (err) {
				throw new Error("Error with redis");
			}

			var serverQueue = JSON.parse(reply);



			if (!serverQueue) {
				const player = manager.create({
					guild: message.guild.id,
					voiceChannel: voiceChannel.id,
					textChannel: message.channel.id,
				});

				player.connect();
				serverQueue = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					songs: []
				};
				serverQueue.songs.push(songQueue);
				clientRedis.set(`guild_${message.guild.id}`, JSON.stringify(serverQueue), "EX", 86400);
				player.play(response.tracks[0]);
			} else {
				serverQueue.songs.push(songQueue);
				clientRedis.set(`guild_${message.guild.id}`, JSON.stringify(serverQueue), "EX", 86400);

				const addQueueEmbed = new Discord.MessageEmbed()
					.setColor('#ed1c24')
					.setTitle(songQueue.title)
					.setURL(songQueue.url)
					.setAuthor(message.client.user.username, message.client.user.avatarURL())
					.setDescription(`[${songQueue.title}](${songQueue.url}) has been added to the queue and is number ${serverQueue.songs.length} in the queue!`)
					.setThumbnail(songQueue.thumbnail);
				
				return message.channel.send(addQueueEmbed)
			}
		})
	},
};