const { clientRedis } = require("../utils/utils");
const getRedis = require("../utils/redis");
const play = require("./playSong");

var queueTime;

function waitForSong(length, guild, msg, player, stopTimeout, client, play) {
  if (stopTimeout) {
    clearTimeout(queueTime);
    return "Hello";
  } else {
    queueTime = setTimeout(async function () {
      await getRedis(`guild_${guild.id}`, async function (err, reply) {
        var serverQueue = JSON.parse(reply);
        serverQueue.songs.shift();
        if (!serverQueue.songs[0]) {
          msg.channel.send(
            "No more songs in the queue! Leaving voice channel."
          );
          clientRedis.del(`guild_${guild.id}`);
          return await player.destroy(true);
        } else {
          clientRedis.set(
            `guild_${msg.guild.id}`,
            JSON.stringify(serverQueue),
            "EX",
            86400
          );
          play(guild, serverQueue.songs[0], null, null, msg, player, client);
        }
      });
    }, length);
  }
}

async function timeoutCode(serverQueue, guild, msg, player, client, play) {}
module.exports = waitForSong;
