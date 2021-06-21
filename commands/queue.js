const Discord = require('discord.js');
const {clientRedis, getRedis} = require('../utils/redis');
const {PagesBuilder} = require('discord.js-pages');

module.exports = {
    name: 'queue',
    description: "Shows the current queue",
    args: false,
    guildOnly: true,
    voice: true,
    async execute(message, args) {
        await getRedis(`guild_${message.guild.id}`, async function (err, reply) {
            if (err) {
                throw new Error("Error with Redis");
            }
            var serverQueue = JSON.parse(reply);

            if (!serverQueue.songs[0]) {
                return message.reply("There is currently no songs in the queue!");
            }
            var size = 2; 
            var songsArray = [];
            //split array into groups of 10
            for (var i=0; i<serverQueue.songs.length; i+=size) {
                songsArray.push(serverQueue.songs.slice(i,i+size));
            }

            var songCount = 0;
            let embedDesc;
            var embedPages = [];

            for(const songGroup in songsArray) {
                const queueEmbed = new Discord.MessageEmbed()

                for(const single in songsArray[songGroup]) {
                    songCount += 1
                    
                    embedDesc += `${songsArray[songGroup][single].title} \n`
                }
                queueEmbed.setDescription(embedDesc);
                embedDesc = "";
                embedPages.push(queueEmbed)

                
            }
            // console.log(songsArray[0][0]);
            
        })
    }
}

