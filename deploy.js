"use strict";
const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const { prefix, token } = require("./config.json"); //skipcq: JS-0266



async function registerCommands() {
  const data = [
    {
      name: "play",
      description: "Plays a song from youtube or spotify.",
      options: [
        {
          name: "songname",
          type: "STRING",
          description: "The Youtube URL, media name or spotify link.",
          required: true,
        },
      ],
    },
    {
      name: "help",
      description: "List's all available commands and info for the commands.",
      options: [
        {
          name: "command",
          type: "STRING",
          description: "Name of command you want help for.",
          required: false,
        },
      ],
    },
    {
      name: "invite",
      description: "Sends an invite link for the bot.",
    },
    {
      name: "nowplaying",
      description: "Shows the media that is currently playing.",
    },
    {
      name: "pause",
      description: "Pause or resume the current song.",
    },
    {
      name: "playlist",
      description:
        "Plays all songs from a youtube playlist or spotify album or playlist.",
      options: [
        {
          name: "playlisturl",
          type: "STRING",
          description: "Link to youtube playlist or spotify album or playlist.",
          required: true,
        },
      ],
    },
    {
      name: "queue",
      description: "Shows the current queue.",
    },
    {
      name: "remove",
      description: "Removes a specifc song from the queue.",
      options: [
        {
          name: "songnumber",
          type: "INTEGER",
          description: "Song number in queue to remove.",
          required: true,
        },
      ],
    },
    {
      name: "skip",
      description: "Skips the current playing song.",
    },
    {
      name: "stop",
      description: "Stop's the currnet playing song and deletes the queue.",
    },
    {
      name: "volume",
      description: "Set's the volume to a number between 0 and 100.",
      options: [
        {
          name: "volume",
          type: "INTEGER",
          description: "Volume",
          required: true,
        },
      ],
    },
  ];
  await client.application?.commands.set(data);
  process.exit(0);
}

registerCommands();

client.login(token);