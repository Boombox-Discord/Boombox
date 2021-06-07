const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, lavalinkIP, lavalinkPort} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' });
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply ("I can't execute this command inside DMs!")
    }

    if (command.args && !args.length) {
        const argsEmbed = new Discord.MessageEmbed()
            .setColor('#ed1c24')
            .setTitle('Incorrect Usage!')
            .setAuthor(client.user.username, client.user.avatarURL())
            .addField(`The proper usage for the ${command.name} command is:`, `${prefix}${command.name} ${command.usage}`)

        return message.channel.send(argsEmbed)
        // return message.channel.send(`You didn't provide any arguments. \n The proper usage is: ${prefix}${command.name} ${command.usage}`);
    }

    try {
        command.execute(message, args);
    } catch (err) {
        console.error(err)
        message.reply('There was an error trying to execute that command!');
    }
})

client.login(token)