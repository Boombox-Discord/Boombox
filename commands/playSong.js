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
      playlistQueue(msg, serverQueue, parse, client);
    }

    const searchQuery = `ytsearch:${serverQueue.songs[0].title}`;
    const results = await player.manager.search(searchQuery);
    const { track, info } = results.tracks[0];

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

    await player.play(track);

    waitForSong(serverQueue, info, guild, msg, player);
  });
}

module.exports = play;
