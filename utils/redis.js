const redis = require("redis");

const {
  redisIP,
  redisPort,
  redisPassword,
} = require("../config.json"); //skipcq: JS-0266

const clientRedis = redis.createClient({
  host: redisIP,
  port: redisPort,
  auth_pass: redisPassword,
});

clientRedis.on("error", function (error) {
  console.error(error);
});

exports.clientRedis = clientRedis;