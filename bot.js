const Discord = require('discord.js');
 const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });


  // Put the Music module in the new Client object.
// This allows for easy access to all the modules
// functions and data.
client.music = require("discord.js-musicbot-addon");

// Now we start the music module.
client.music.start(client, {
  // Set the api key used for YouTube.
  // This is required to run the bot.
  youtubeKey: "AIzaSyB1TAY_jKKsyYqjndOsXawXexsSTfunzo0"
});

client.on('message', msg => {
 if (msg.content === 'hello' || msg.content === 'Hello') {
 msg.reply('Hello!');
 } else if (msg.content === 'fuck' || msg.content === 'Fuck') {
    const nsfwlemon = client.emojis.find(emoji => emoji.name === "nsfwlemon");
    msg.reply(`me ${nsfwlemon} `);
 } else if (msg.content === 'dinosaur' || msg.content === 'Dinosaur') {
    msg.reply('Here have a Dinosaur!')
    msg.reply('https://media.giphy.com/media/W0QniYnt2WSMrMwDrS/giphy.gif')
 } else if (msg.content === 'pussy' || msg.content === 'pussy') {
   const ahegao = client.emojis.find(emoji => emoji.name === "3932_ahegao");
   msg.reply(`${ahegao} `);
 } else if (msg.content === 'gay' || msg.content === 'Gay') {
   const gay = client.emojis.find(emoji => emoji.name === "prideheart");
   message.react(`${gay} `);
 }
 });



client.login('Njc4ODE5OTk0MjUwNzcyNDgw.XkooRw.WejqmOp3evx2MgkwZthfchMwJBw');