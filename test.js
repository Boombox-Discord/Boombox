const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const ytdl = require("ytdl-core");
const Lynx = require("lynx");
const lyricsAPI = require("genius-lyrics-api"); // skipcq: JS-0128
const { Manager } = require("lavaclient");
const redis = require("redis");

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
  redisPort,
  redisIP,
} = require("./config.json"); //skipcq: JS-0266

clientRedis = redis.createClient(redisPort, redisIP, redis);

var serverQueue;
var key = "guild_770511689258237973";

function getRedis(key, callback) {
  clientRedis.get(key, function (err, reply) {
    callback(reply);
  });
}

// console.log(serverQueue)
