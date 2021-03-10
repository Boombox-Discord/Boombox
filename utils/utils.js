const redis = require("redis");
const Lynx = require("lynx");

const {
  statsdURL,
  statsdPort,
  redisIP,
  redisPort,
  redisPassword,
} = require("../config.json"); //skipcq: JS-0266

var Metrics = new Lynx(statsdURL, statsdPort);

const clientRedis = redis.createClient(redisPort, redisIP, redisPassword);

clientRedis.on("error", function (error) {
  console.log("ankglsjndfkg");
  console.error(error);
});

exports.Metrics = Metrics;
exports.clientRedis = clientRedis;
