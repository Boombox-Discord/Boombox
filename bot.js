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

  var msgsplit = msg.content.split(" ");

 if (msgsplit.includes('hello') || msgsplit.includes('Hello')) {
  msg.channel.send('Hello!');
 } else if (msgsplit.includes('fuck') || msgsplit.includes('Fuck')) {
    const nsfwlemon = client.emojis.find(emoji => emoji.name === "nsfwlemon");
    msg.channel.send(`me ${nsfwlemon} `);
 } else if (msgsplit.includes('dinosaur') || msgsplit.includes('Dinosaur')) {
    msg.channel.send('Here have a Dinosaur!')
    msg.channel.send('https://media.giphy.com/media/W0QniYnt2WSMrMwDrS/giphy.gif')
 } else if (msgsplit.includes('pussy') || msgsplit.includes('pussy')) {
   const ahegao = client.emojis.find(emoji => emoji.name === "3932_ahegao");
   msg.channel.send(`${ahegao} `);
 } else if (msg.isMentioned(client.users.get('451641455627206667')) && msgsplit.includes('test')) {
    const gay = client.emojis.find(emoji => emoji.name === "prideheart");
    msg.react(gay);
    msg.channel.send("@451641455627206667 gay");
 }else if (msgsplit.includes('trans') || msgsplit.includes('Trans') || msgsplit.includes('transgender') || msgsplit.includes('Transgender')) {
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
 } 
 });



client.login('Njc4ODE5OTk0MjUwNzcyNDgw.XkooRw.WejqmOp3evx2MgkwZthfchMwJBw');