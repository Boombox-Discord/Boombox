const { Metrics, clientRedis } = require('../utils/utils');

async function remove(serverQueue, msg) {
    Metrics.increment('boombox.remove');
    if (!msg.member.voice.channel) {
        return msg.channel.send("You have to be in a voice channel to remove a song from the queue!")
    }
    if (!serverQueue) {
        return msg.channel.send("There is currently no queue!")
    }
    const args = msg.content.split(" ");
    if (serverQueue.songs.length > args[1] || args[1] < 0) {
        return msg.channel.send(`Sorry, the queue is only ${serverQueue.songs.length} songs long!`)
    }
    if (!args[1]) {
        return msg.channel.send('You did not provide a track to remove from the queue!');
    }
    var argsNum = parseInt(args[1])
    deletedSong = serverQueue.songs[argsNum - 1].title
    
    serverQueue.songs.splice(argsNum - 1, 1)
    clientRedis.set(`guild_${msg.guild.id}`, JSON.stringify(serverQueue), 'EX', 86400);
    return msg.channel.send(`Ok, I have removed ${deletedSong} from the queue!`)
}

module.exports = remove;