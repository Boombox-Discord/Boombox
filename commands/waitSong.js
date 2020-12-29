const { clientRedis } = require("../utils/utils");
const play = require('./playSong');

var queueTime;

function waitForSong(serverQueue, length, guild, msg, player, stopTimeout, client) {
  if (stopTimeout) {
    clearTimeout(queueTime);
    return;
  }
  queueTime = setTimeout(async function () {
    serverQueue.songs.shift();
    if (!serverQueue.songs[0]) {
      msg.channel.send("No more songs in the queue! Leaving voice channel.");
      clientRedis.del(`guild_${guild.id}`);
      return await player.destroy(true);
    } else {
      clientRedis.set(
        `guild_${msg.guild.id}`,
        JSON.stringify(serverQueue),
        "EX",
        86400
      );
      play(guild, serverQueue.songs[0], null, null, null, msg);
      return msg.channelsend({
        embed: {
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL(),
          },
          title: serverQueue.songs[0].title,
          url: serverQueue.songs[0].videoURL,
          color: 16711680,
          description: `${serverQueue.songs[0].title} is now playing!`,
          thumbnail: {
            url: serverQueue.songs[0].imgurl,
          },
        },
      });
    }
  }, length);
}
module.exports = waitForSong;
