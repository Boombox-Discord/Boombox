const { ShardingManager } = require('discord.js');
const {
    token
} = require("./config.json"); //skipcq: JS-0266

const manager = new ShardingManager('./bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();