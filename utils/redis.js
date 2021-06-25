"use strict";
const redis = require("redis");

const { redisIP, redisPort, redisPassword } = require("../config.json"); //skipcq: JS-0266

const clientRedis = redis.createClient({
  host: redisIP,
  port: redisPort,
  auth_pass: redisPassword,
});

clientRedis.on("error", function (error) {
  console.error(error); //skipcq: JS-0002
});

async function getRedis(key, callback) {
  clientRedis.get(key, function (err, reply) {
    callback(err, reply);
  });
}

exports.getRedis = getRedis;
exports.clientRedis = clientRedis;
