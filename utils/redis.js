"use strict";
const asyncRedis = require("async-redis");
const redis = require("redis");

const { redisIP, redisPort, redisPassword } = require("../config.json"); //skipcq: JS-0266

const redisClient = redis.createClient({
  host: redisIP,
  port: redisPort,
  auth_pass: redisPassword,
});

const asyncRedisClient = asyncRedis.decorate(redisClient)

redisClient.on("error", function (error) {
  console.error(error); //skipcq: JS-0002
});

exports.clientRedis = asyncRedisClient;
//we have to export the non async redis client for node-redis-scan to work properly.
exports.clientRedisNoAsync = redisClient;