const play = require("./playSong");
const { Metrics, clientRedis } = require("../utils/utils");
const stopTimeout = require("../utils/functions");

function stop(msg, serverQueue, player, client) {
  Metrics.increment("boombox.stop");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  }
  if (!serverQueue) {
    return msg.channel.send("There is no song currently playing to stop!");
  }
  serverQueue.songs = [];
  clientRedis.set(
    `guild_${msg.guild.id}`,
    JSON.stringify(serverQueue),
    "EX",
    86400
  );
  stopTimeout();
  play(msg.guild, serverQueue.songs[0], null, null, msg, player, client);
}

module.exports = stop;
