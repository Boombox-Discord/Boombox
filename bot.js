const Discord = require('discord.js');

const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const queue = new Map();

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
 client.user.setActivity("fucking bitches");
 });



var fatFuckFriday = setInterval(function () {
  var date = new Date();
  var day = date.getDay();
  var timeh = date.getHours();
  var timem = date.getMinutes();
  if (day === 5 && timeh === 12 && timem === 00) {
    client.channels.get("592556176009592836").send("@everyone FAT FUCK FRIDAY");
    client.channels.get("592556176009592836").send({files: ["fat.jpg"]});
    console.log("Message sent")
  }
}, 40 * 1000);

var twoFrogTuesday = setInterval(function () {
  var date = new Date();
  var day = date.getDay();
  var timeh = date.getHours();
  var timem = date.getMinutes();
  if (day === 2 && timeh === 12 && timem === 00) {
    client.channels.get("592556176009592836").send("@everyone two frogs tuesday");
    client.channels.get("592556176009592836").send({files: ["frog.png"]});
    console.log("Message sent")
  }
}, 40 * 1000);

var milfMonady = setInterval(function () {
  var date = new Date();
  var day = date.getDay();
  var timeh = date.getHours();
  var timem = date.getMinutes();
  if (day === 1 && timeh === 12 && timem === 00) {
    client.channels.get("592556176009592836").send("@everyone MILF Monday");
    client.channels.get("592556176009592836").send({files: ["milf_monday.mp4"]});
    console.log("Message sent")
  }
}, 40 * 1000);


client.on('message', async msg => {

  if(msg.author.bot) return;

  var msgsplit = msg.content.split(" ");

 if (msgsplit.includes('hello') || msgsplit.includes('Hello')) {
  msg.channel.send('Hello!');
 } else if (msg.content === 'Fuck' || msg.content === 'fuck') {
    const nsfwlemon = client.emojis.find(emoji => emoji.name === "nsfwlemon");
    msg.channel.send(`me ${nsfwlemon} `);
 } else if (msgsplit.includes('dinosaur') || msgsplit.includes('Dinosaur')) {
    msg.channel.send('Here have a Dinosaur!')
    msg.channel.send('https://media.giphy.com/media/W0QniYnt2WSMrMwDrS/giphy.gif')
 } else if (msgsplit.includes('pussy') || msgsplit.includes('pussy')) {
   const ahegao = client.emojis.find(emoji => emoji.name === "ahegao");
   msg.channel.send(`${ahegao} `);
 } else if (msg.isMentioned(client.users.get('451641455627206667')) && msgsplit.includes('gay')) {
    const gay = client.emojis.find(emoji => emoji.name === "prideheart");
    msg.react(gay);
    msg.channel.send("<@451641455627206667> gay");
 }else if (msgsplit.includes('trans') || msgsplit.includes('Trans') || msgsplit.includes('transgender') || msgsplit.includes('Transgender') || msgsplit.includes('smore') || msgsplit.includes('Smore') || msgsplit.includes('Transpride') || msgsplit.includes('transpride')) {
   const trans = client.emojis.find(emoji => emoji.name === "transheart");
   msg.react(trans);
 } else if (msgsplit.includes('NB') || msgsplit.includes('non-binary') || msgsplit.includes('Non-Binary') || msgsplit.includes('ENBY') || msgsplit.includes('Non-binary')) {
   const NB = client.emojis.find(emoji => emoji.name === "nbheart");
   msg.react(NB);
 } else if (msgsplit.includes('pan') || msgsplit.includes('Pan') || msgsplit.includes('Pansexual') || msgsplit.includes('pansexual')) {
   const pan = client.emojis.find(emoji => emoji.name === "panheart");
   msg.react(pan);
 } else if (msgsplit.includes('Lesbian') || msgsplit.includes('lesbian')) {
   const lesbian = client.emojis.find(emoji => emoji.name === 'lesbianheart');
   msg.react(lesbian);
 } else if (msgsplit.includes('shrek') || msgsplit.includes('Shrek')) {
   const shrek = client.emojis.find(emoji => emoji.name === 'shrexualheart');
   msg.react(shrek);
   msg.channel.send("Shrek is love...");
   msg.channel.send("Shrek is life.")
 } else if (msgsplit.includes('bi') || msgsplit.includes('Bi') || msgsplit.includes('Bisexual') || msgsplit.includes('bisexual')) {
   const bi = client.emojis.find(emoji => emoji.name === 'biheart');
   msg.react(bi);
 } else if (msgsplit.includes('gay') || msgsplit.includes('Gay')) {
  const gay = client.emojis.find(emoji => emoji.name === "prideheart");
  msg.react(gay);
 } else if (msgsplit.includes("piss") || msgsplit.includes('Piss') || msgsplit.includes('pee') || msgsplit.includes('Pee')) {
  const piss = client.emojis.find(emoji => emoji.name === "7136_piss_heart_time");
   msg.react(piss);
   msg.channel.send(`${piss}`)
 } else if(msgsplit.includes("Life changer")) {
    msg.channel.send('miracle arnager');
 } else if (msgsplit.includes('69')) {
  msg.channel.send('nice');
} else if (msgsplit.includes('emily') || msgsplit.includes('Emily')) {
  msg.channel.send({files: ["Emily.jpg"]});
} else if (msgsplit.includes('FAT') && msgsplit.includes("FUCK")) {
  msg.channel.send({files: ["fat.jpg"]});
} else if (msg.isMentioned(client.users.get('451641455627206667')) && msgsplit.includes('het')) {
  const gay = client.emojis.find(emoji => emoji.name === "prideheart");
  msg.channel.send("<@451641455627206667> het");
} else if (msg.isMentioned(client.users.get('651228303939731466')) && msgsplit.includes('het')) {
  msg.channel.send("<@651228303939731466> het");
} else if (msg.isMentioned(client.users.get('651228303939731466')) && msgsplit.includes('ishet?')) {
  msg.channel.send("<@651228303939731466> is very het");
  msg.channel.send({files: ["EmilyHet.png"]});
} else if (msgsplit.includes('two') && msgsplit.includes("frogs")) {
  msg.channel.send({files: ["frog.png"]});
}


const serverQueue = queue.get(msg.guild.id);

if (msg.content.startsWith(`${prefix}play`)) {
  execute(msg, serverQueue);
  return;
} else if (msg.content.startsWith(`${prefix}skip`)) {
  skip(msg, serverQueue);
  return;
} else if (msg.content.startsWith(`${prefix}stop`)) {
  stop(msg, serverQueue);
  return;
} else {
  msg.channel.send('You need to enter a valid command!')
}
});

async function execute(msg, serverQueue) {
const args = msg.content.split(' ');

const voiceChannel = msg.member.voiceChannel;
if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to play music!');
const permissions = voiceChannel.permissionsFor(msg.client.user);
if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
  return msg.channel.send('I need the permissions to join and speak in your voice channel!');
}

const songInfo = await ytdl.getInfo(args[1]);
const song = {
  title: songInfo.title,
  url: songInfo.video_url,
};

if (!serverQueue) {
  const queueContruct = {
    textChannel: msg.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  };

  queue.set(msg.guild.id, queueContruct);

  queueContruct.songs.push(song);

  try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    play(msg.guild, queueContruct.songs[0]);
  } catch (err) {
    console.log(err);
    queue.delete(msg.guild.id);
    return msg.channel.send(err);
  }
} else {
  serverQueue.songs.push(song);
  console.log(serverQueue.songs);
  return msg.channel.send(`${song.title} has been added to the queue!`);
}

}

function skip(msg, serverQueue) {
if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
if (!serverQueue) return msg.channel.send('There is no song that I could skip!');
serverQueue.connection.dispatcher.end();
}

function stop(msg, serverQueue) {
if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
serverQueue.songs = [];
serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
const serverQueue = queue.get(guild.id);

if (!song) {
  serverQueue.voiceChannel.leave();
  queue.delete(guild.id);
  return;
}

const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
  .on('end', () => {
    console.log('Music ended!');
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  })
  .on('error', error => {
    console.error(error);
  });
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

 };



client.login("Njc4ODE5OTk0MjUwNzcyNDgw.XowhvQ.rqgZjV0v4hcA7A52yjNTFeIHWjU");