const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const ytdl = require("ytdl-core");
const Lynx = require("lynx");
const lyricsAPI = require("genius-lyrics-api"); // skipcq: JS-0128
const { Manager } = require("lavaclient");

const {
  prefix,
  token,
  youtubeApi,
  inviteLink,
  statsdURL,
  statsdPort,
  geniusApiKey,
  errorChannel,
  lavalinkIP,
  lavalinkPort,
  lavalinkPassword,
} = require("./config.json"); //skipcq: JS-0266

const searchSong = require("genius-lyrics-api/lib/searchSong");
const getLyrics = require("genius-lyrics-api/lib/getLyrics");
const BoomboxErrors = require("./errors/errors");

const nodes = [
  {
    id: "main",
    host: lavalinkIP,
    port: lavalinkPort,
    password: lavalinkPassword,
  },
];

const client = new Discord.Client();

const queue = new Map();

const manager = new Manager(nodes, {
  shards: 1,

  send(id, data) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(data);
    return;
  },
});

var Metrics = new Lynx(statsdURL, statsdPort);

client.on("ready", async () => {
  await manager.init(client.user.id);
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`for ${prefix}help`, { type: "WATCHING" });
});

client.on("guildCreate", (guild) => {
  client.channels.get("770865244171272232").send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: "New Guild Join",
      color: 16711680,
      footer: {
        text: "Guild count: " + client.guilds.size,
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

client.on("message", async (msg) => {
  if (msg.author.bot) {
    return;
  }
  if (!msg.content.startsWith(prefix)) {
    return;
  }

  const serverQueue = queue.get(msg.guild.id);
  const player = await manager.create(msg.guild.id);

  if (msg.content.startsWith(`${prefix}join`)) {
    await player.connect(msg.member.voice.channelID, { selfDeaf: true });

    const results = await player.manager.search("ytsearch:Campus");

    if (!results || !results.tracks.length) return;

    const { track, info } = results.tracks[0];
    await player.play(track);
  } else if (msg.content.startsWith(`${prefix}destroy`)) {
    await player.destroy(true);
  }
});

manager.on("socketError", ({ id }, error) =>
  console.error(`${id} ran into an error`, error)
);
manager.on("socketReady", (node) => console.log(`${node.id} connected.`));

client.ws.on("VOICE_STATE_UPDATE", (upd) => manager.stateUpdate(upd));
client.ws.on("VOICE_SERVER_UPDATE", (upd) => manager.serverUpdate(upd));

client.login(token);
