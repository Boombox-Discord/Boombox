const { Metrics, clientRedis } = require("../utils/utils");
const waitSong = require("./waitSong");

function skip(msg, serverQueue, player, client, play) {
  Metrics.increment("boombox.skip");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to skip the music!"
    );
  }
  if (!serverQueue) {
    return msg.channel.send("There is no song that I could skip!");
  }
  serverQueue.songs.shift();
  clientRedis.set(
    `guild_${msg.guild.id}`,
    JSON.stringify(serverQueue),
    "EX",
    86400
  );
  waitSong(null, msg.guild, msg, player, true, client, null); //stop current wait for song
  play(msg.guild, serverQueue.songs[0], null, null, msg, player, client);
}

module.exports = skip;
