module.exports = {
	name: 'play',
	description: 'Plays a song from youtube.',
    args: true,
    usage: '<youtube URL or song name>',
	guildOnly: true,
	execute(message, args) {
		message.channel.send('Pong.');
		message.channel.send(args)
	},
};