const { Metrics } = require("../utils/utils");
const waitForSong = require("./waitSong");

function pause(msg, serverQueue, player, client, play) {
  Metrics.increment("boombox.pause");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to pause a song!"
    );
  }

  if (!serverQueue) {
    return msg.channel.send("There is currently no song playing!");
  }
  if (!player.paused) {
    waitForSong(null, msg.guild, msg, player, true, client, play);
    player.pause(true);
    return msg.channel.send("I have paused the music!");
  } else {
    const position = player.position;
    const length = serverQueue.songs[0].info.length;
    const timeLeft = length - position;
    player.resume();
    const guild = msg.guild;
    waitForSong(serverQueue, timeLeft, guild, msg, player, false);
  }
}
module.exports = pause;

//
