const { Metrics } = require("../utils/utils");

function queuemsg(msg, serverQueue, client) {
  Metrics.increment("boombox.queue");
  if (!msg.member.voice.channel) {
    return msg.channel.send(
      "You have to be in a voice channel to request the queue."
    );
  }
  if (!serverQueue) {
    return msg.channel.send("There is currently no songs in the queue!");
  }
  var serverQueueSongs = showObject(serverQueue.songs);

  if (serverQueueSongs.includes("21. ")) {
    serverQueueSongs = serverQueueSongs.split("21. ");
    serverQueueSongs = serverQueueSongs[0];
  }

  return msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: "First 20 songs in the queue.",
      color: 16711680,
      description: serverQueueSongs,
      thumbnail: {
        url: serverQueue.songs["0"].imgurl,
      },
    },
  });
}

function showObject(obj) {
  var result = [];
  var i;
  for (i = 0; i < obj.length; i++) {
    var numberInQueue = i + 1;
    result += numberInQueue + ". " + obj[i].title + "\n";
  }
  return result;
}

module.exports = queuemsg;
