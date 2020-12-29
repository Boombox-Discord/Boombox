const { Metrics } = require("../utils/utils");

function volume(msg, serverQueue, player) {
  Metrics.increment("boombox.volume");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to change the volume!"
    );
  }
  if (!serverQueue) {
    return msg.channel.send("There is no song playing.");
  }
  const args = msg.content.split(" ");
  if (args[1] >= 101 || args[1] <= 0) {
    return msg.channel.send("Please select a number between 1 and 5.");
  }
  player.setVolume(args[1]);
  msg.channel.send("I have set the volume to " + args[1]);
}

module.exports = volume;
