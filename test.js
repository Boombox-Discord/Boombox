'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('ws');

const {
	prefix,
	token,
} = require('./config.json');

const client = new Discord.Client();


const webSocket = new WebSocket("ws://192.168.178.176:2333/", {
  perMessageDeflate: false,
  headers: {
    Authorization: `Arrow2080`,
  },
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
});

client.on('raw', packets => {
    if (!['VOICE_STATE_UPDATE'].includes(packets.t)) return;
    console.log(packets.d.session_id)
    console.log(packets.d.guild_id)
});

client.login(token);