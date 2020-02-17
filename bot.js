const Discord = require('discord.js');
 const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
 if (msg.content === 'hello' || msg.content === 'Hello') {
 msg.reply('Hello!');
 } else if (msg.content === 'fuck' || msg.content === 'Fuck') {
    const ayy = client.emojis.find(emoji => emoji.name === "nsfwlemon");
    msg.reply(`me ${ayy} `);
 } else if (msg.content === 'dinosaur' || msg.content === 'Dinosaur') {
    msg.reply('Here have a Dinosaur!')
    msg.reply('https://media.giphy.com/media/W0QniYnt2WSMrMwDrS/giphy.gif')
 } else if (msg.content === '' || msg.content === '') {
    
 }
 });

client.login('Njc4ODE5OTk0MjUwNzcyNDgw.XkooRw.WejqmOp3evx2MgkwZthfchMwJBw');