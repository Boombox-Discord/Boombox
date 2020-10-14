'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const WebSocket = require('ws');

const {
	prefix,
	token,
} = require('./config.json');

const client = new Discord.Client();


const webSocket = new WebSocket("ws://123.255.48.162:2333/", {
  headers: {
    "Authorization": "Arrow2080",
    "Num-Shards": 1,
    "User-ID": "678819994250772480"
  },
});

webSocket.on('message', function incoming(data) {
  console.log(data);
});


webSocket.on('open', function open() {
  console.log("Connected!");
});

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});


client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.user.setActivity(`Currently not vibing to anything`);
 });

client.on('message', async msg => {

  if(msg.author.bot) return;
  if (!msg.content.startsWith("!")) return;

  if (msg.content.startsWith(`${prefix}join`)) {
    const voiceChannel = msg.member.voiceChannel;
    const connection = await voiceChannel.join();
  }
  if (msg.content.startsWith(`${prefix}play`)) {
    let play = {
      "op": "play",
      "guildId": "592556176009592834",
      "track": "QAAAqgIAREFub3RoZXIgRGF5IG9mIFN1biAtIExhIExhIExhbmQgKE9yaWdpbmFsIE1vdGlvbiBQaWN0dXJlIFNvdW5kdHJhY2spAAxWw61jdG9yIEh1Z28AAAAAAAN6oAALQ1duWUliMmxxcG8AAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1DV25ZSWIybHFwbwAHeW91dHViZQAAAAAAAAAA",
      "noReplace": false
  };

  webSocket.send(JSON.stringify(play));
  }
});


client.on('raw', packets => {
    if (!['VOICE_SERVER_UPDATE'].includes(packets.t)) return;
    // if (['VOICE_SERVER_UPDATE'].includes(packets.t)) {
    //   var event = packets.d;
    //   tokent = packets.d.token
    // }
    // if (['VOICE_STATE_UPDATE'].includes(packets.t)) {
    //   guildId = packets.d.guild_id;
    //   sessionId = packets.d.session_id;
    // }
    console.log(packets)
    let connect = {
      "op": "voiceUpdate",
      "guildId": packets.d.guild_id,
      "event": packets.d,
      // "token": tokent
    }
    console.log(connect)
    webSocket.send(JSON.stringify(connect));
});

client.login(token);