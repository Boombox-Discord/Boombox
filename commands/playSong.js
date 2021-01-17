const waitForSong = require("./waitSong");
const Lynx = require("lynx");
const { clientRedis } = require("../utils/utils");
const getRedis = require("../utils/redis");
const playlistQueue = require("./playlistQueue");

async function play(guild, song, playlist, parse, msg, player, client) {
  await getRedis(`guild_${guild.id}`, async function (err, reply) {
    var serverQueue = JSON.parse(reply);

    if (!song) {
      msg.channel.send("No more songs in the queue! Leaving voice channel.");
      clientRedis.del(`guild_${guild.id}`);
      return await player.destroy(true);
    }

    if (playlist === "playlist") {
      playlistQueue(msg, serverQueue, parse, client, player);
    }

    if (serverQueue.connected) {
    } else if (!serverQueue.connected) {
      await player.connect(serverQueue.voiceChannel.id);
      serverQueue.connected = true;
      clientRedis.set(
        `guild_${msg.guild.id}`,
        JSON.stringify(serverQueue),
        "EX",
        86400
      );
    }

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
      serverQueue.songs[0].info.length,
      guild,
      msg,
      player,
      false,
      client,
      play
    );
  });
}

module.exports = play;
