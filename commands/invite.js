const {inviteLink} = require('../config.json');
const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "Sends an invite link for the bot.",
    args: false,
    guildOnly: false,
    voice: false,
    async execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#ed1c24')
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .setTitle(`Click Here to Invite ${message.client.user.username} To Your Server!`)
            .setURL(inviteLink)
        return message.channel.send(embed);
    }
}