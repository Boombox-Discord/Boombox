const waitForSong = require("./waitSong");
const Lynx = require("lynx");
const { clientRedis } = require("../utils/utils");
const getRedis = require("../utils/redis");
const playlistQueue = require("./playlistQueue");

async function play(guild, song, playlist, parse, msg, player, client) {
  await getRedis(`guild_${guild.id}`, async function (reply) {
    var serverQueue = JSON.parse(reply);

    if (!song) {
      msg.channel.send("No more songs in the queue! Leaving voice channel.");
      clientRedis.del(`guild_${guild.id}`);
      return await player.destroy(true);
    }

    if (playlist === "playlist") {
      playlistQueue(msg, serverQueue, parse, client, player);
    }

    await player.connect(serverQueue.voiceChannel.id);

    msg.channel.send({
      embed: {
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL(),
        },
        title: serverQueue.songs[0].title,
        url: serverQueue.songs[0].url,
        color: 16711680,
        description: `${serverQueue.songs[0].title} is now playing!`,
        thumbnail: {
          url: serverQueue.songs[0].imgurl,
        },
      },
    });

    await player.play(serverQueue.songs[0].track);

    waitForSong(
      serverQueue,
      serverQueue.songs[0].info.length,
      guild,
      msg,
      player,
      false,
      client
    );
  });
}

module.exports = play;
