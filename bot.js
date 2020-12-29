const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const lyricsAPI = require("genius-lyrics-api"); // skipcq: JS-0128
const { Manager, Player } = require("lavaclient");

const {
  prefix,
  token,
  errorChannel,
  lavalinkIP,
  lavalinkPort,
  lavalinkPassword,
} = require("./config.json"); //skipcq: JS-0266

const BoomboxErrors = require("./errors/errors");
const execute = require("./commands/play");
const playlist = require("./commands/playlist");
const queuemsg = require("./commands/queue");
const skip = require("./commands/skip");
const stop = require("./commands/stop");
const np = require("./commands/nowPlaying");
const volume = require("./commands/volume");
const help = require("./commands/help");
const invite = require("./commands/invite");
const lyrics = require("./commands/lyrics");
const pause = require("./commands/pause");
const { clientRedis } = require("./utils/utils");
const getRedis = require("./utils/redis");
const remove = require('./commands/remove');

const client = new Discord.Client();

const nodes = [
  {
    id: "main",
    host: lavalinkIP,
    port: lavalinkPort,
    password: lavalinkPassword,
  },
];

const manager = new Manager(nodes, {
  shards: 1,

  send(id, data) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(data);
    return;
  },
});

client.on("guildCreate", (guild) => {
  client.channels.cache.get("770865244171272232").send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL(),
      },
      title: "New Guild Join",
      color: 16711680,
      footer: {
        text: "Guild count: " + client.guilds.cache.size,
      },
      thumbnail: {
        url: guild.iconURL,
      },
      fields: [
        {
          name: "Guild name",
          value: guild.name,
        },
        {
          name: "Guild ID",
          value: guild.id,
        },
      ],
    },
  });
});

client.on("ready", async () => {
  await manager.init(client.user.id);
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`for ${prefix}help`, { type: "WATCHING" });
});

client.on("message", async (msg) => {
  if (msg.author.bot) {
    return;
  }
  if (!msg.content.startsWith(prefix)) {
    return;
  }

  await getRedis(`guild_${msg.guild.id}`, async function (reply) {
    var serverQueue = JSON.parse(reply);

    const player = await manager.create(msg.guild.id);

    if (msg.content.startsWith(`${prefix}playlist`)) {
      try {
        playlist(msg, serverQueue, player, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "playlist",
          client,
          "Error playing song from youtube playlist.",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}skip`)) {
      try {
        skip(msg, serverQueue, player, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "skip",
          client,
          "Error skipping song",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}stop`)) {
      try {
        stop(msg, serverQueue, player, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "stop",
          client,
          "Error stopping song",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}np`)) {
      try {
        np(msg, serverQueue, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "now playing",
          client,
          "Error getting now playing",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}queue`)) {
      // try {
        queuemsg(msg, serverQueue, client);
        return;
      // } catch (err) {
      //   throw new BoomboxErrors(
      //     msg,
      //     "queue",
      //     client,
      //     "Error stopping song",
      //     errorChannel
      //   );
      // }
    } else if (msg.content.startsWith(`${prefix}volume`)) {
      try {
        volume(msg, serverQueue, player);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "volume",
          client,
          "Error changing volume",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}help`)) {
      try {
        help(msg, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "help",
          client,
          "Error displaying help command",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}invite`)) {
      try {
        invite(msg, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "invite",
          client,
          "Error displaying bot invite",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}lyrics`)) {
      try {
        lyrics(msg, serverQueue, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "lyrics",
          client,
          "Error displaying lyrics",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}play`)) {
      try {
        execute(msg, serverQueue, player, client);
        return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "play",
          client,
          "Error playing song.",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}pause`)) {
      try {
      pause(msg, serverQueue, player);
      return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "pause",
          client,
          "Error pausing song.",
          errorChannel
        );
      }
    } else if (msg.content.startsWith(`${prefix}remove`)) {
      try {
      remove(serverQueue, msg);
      return;
      } catch (err) {
        throw new BoomboxErrors(
          msg,
          "remove",
          client,
          "Error removing song.",
          errorChannel
        );
      }
    }
  });
});

manager.on("socketError", ({ id }, error) =>
  console.error(`${id} ran into an error`, error)
);
manager.on("socketReady", (node) => console.log(`${node.id} connected.`));

client.ws.on("VOICE_STATE_UPDATE", (upd) => manager.stateUpdate(upd));
client.ws.on("VOICE_SERVER_UPDATE", (upd) => manager.serverUpdate(upd));

client.login(token);
