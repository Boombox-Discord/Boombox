const { clientRedis } = require("./utils");

async function getRedis(key, callback) {
  clientRedis.get(key, function (err, reply) {
    callback(reply);
  });
}

module.exports = getRedis;
