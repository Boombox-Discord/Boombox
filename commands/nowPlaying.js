const { Metrics } = require("../utils/utils");

function np(msg, serverQueue, client) {
  Metrics.increment("boombox.np");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to see what is currently playing!"
    );
  }
  if (!serverQueue) {
    return msg.channel.send("There is currently no song playing!");
  }
  return msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL(),
      },
      title: "Currnet song playing",
      color: 16711680,
      description: serverQueue.songs[0].title + " is currently playing!",
      thumbnail: {
        url: serverQueue.songs["0"].imgurl,
      },
    },
  });
}

module.exports = np;
