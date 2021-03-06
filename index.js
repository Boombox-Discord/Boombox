"use strict";
const fs = require("fs");
const Discord = require("discord.js");
const { Manager } = require("erela.js");
const { clientRedis, getRedis } = require("./utils/redis");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const {
  prefix,
  token,
  lavalinkIP,
  lavalinkPort,
  lavalinkPassword,
  sentryDSN,
  sentryEnv,
} = require("./config.json"); //skipcq: JS-0266

const client = new Discord.Client();
client.commands = new Discord.Collection();

Sentry.init({
  dsn: sentryDSN,
  tracesSampleRate: 1.0,
  environment: sentryEnv,
});

client.manager = new Manager({
  nodes: [
    {
      host: lavalinkIP,
      port: lavalinkPort,
      password: lavalinkPassword,
    },
  ],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) {
      guild.shard.send(payload);
    }
  },
})
  .on(
    "nodeConnect",
    (node) => console.log(`Node ${node.options.identifier} connected`) //skipcq: JS-0002
  )
  .on(
    "nodeError",
    (node, error) =>
      console.log(
        `Node ${node.options.identifier} had an error: ${error.message}`
      ) //skipcq: JS-0002
  )
  .on("trackStart", (player, track) => {
    const newQueueEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle(track.title)
      .setURL(track.uri)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setDescription(
        `[${track.title}](${track.uri}) is now playing and is number 1 in the queue!`
      )
      .setThumbnail(track.thumbnail);

    client.channels.cache.get(player.textChannel).send(newQueueEmbed);
  })
  .on("queueEnd", async (player) => {
    await getRedis(`guild_${player.guild}`, async function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }
      const serverQueue = JSON.parse(reply);

      serverQueue.songs.shift();

      if (!serverQueue.songs[0]) {
        clientRedis.del(`guild_${player.guild}`);
        player.destroy();
        return client.channels.cache
          .get(player.textChannel)
          .send("No more songs in queue, leaving voice channel!");
      }
      clientRedis.set(
        `guild_${player.guild}`,
        JSON.stringify(serverQueue),
        "EX",
        86400 //skipcq: JS-0074
      );
      const response = await client.manager.search(serverQueue.songs[0].url);
      player.play(response.tracks[0]);
    });
  });

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`); //skipcq: JS-0002
  client.manager.init(client.user.id);
  client.user.setActivity(`for ${prefix}help`, { type: "WATCHING" });
});

// send voice events to lavalink library

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {
    return;
  }

  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute this command inside DMs!");
  }

  if (command.args && !args.length) {
    const argsEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle("Incorrect Usage!")
      .setAuthor(client.user.username, client.user.avatarURL())
      .addField(
        `The proper usage for the ${command.name} command is:`,
        `${prefix}${command.name} ${command.usage}`
      );

    return message.channel.send(argsEmbed);
  }

  if (command.voice) {
    if (!message.member.voice.channel) {
      return message.reply(
        "You need to be in a voice channel to run that command!"
      );
    }
  }

  const transaction = Sentry.startTransaction({
    op: "command",
    name: "Command ran on Boombox",
  });

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err); //skipcq: JS-0002
    message.reply("There was an error trying to execute that command!");
    Sentry.captureException(err);
  } finally {
    transaction.finish();
  }
});

client.login(token);
