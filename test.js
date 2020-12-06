const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const ytdl = require("ytdl-core");
const Lynx = require("lynx");
const lyricsAPI = require("genius-lyrics-api"); // skipcq: JS-0128

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
  lavalinkPassword
} = require("./config.json"); //skipcq: JS-0266

const searchSong = require("genius-lyrics-api/lib/searchSong");
const getLyrics = require("genius-lyrics-api/lib/getLyrics");
const BoomboxErrors = require("./errors/errors");

const client = new Discord.Client();

const queue = new Map();

var Metrics = new Lynx(statsdURL, statsdPort);

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

client.on("ready", () => {
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

  const serverQueue = queue.get(msg.guild.id);

  if (msg.content.startsWith(`${prefix}join`)) {
    try {
      if (msg.member.voice.channel) {
          const connection = await msg.member.voice.channel.join();
      } else {
          msg.reply("You need to join a voice channel first!");
      }
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
  }
});

client.login(token);
