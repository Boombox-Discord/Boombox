const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List's all available commands and info for the commands.",
  usage: "[command name]",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      const helpEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setTitle(`${message.client.user.username} Help`)
        .setAuthor(
          message.client.user.username,
          message.client.user.avatarURL()
        )
        .setDescription(
          `Below are all avilable commands for ${message.client.user.username}`
        );
      commands.map((command) => {
        if (!command.usage) {
          helpEmbed.addField(`${prefix}${command.name}`, command.description);
        } else {
          helpEmbed.addField(
            `${prefix}${command.name} ${command.usage}`,
            command.description
          );
        }
      });

      return message.author
        .send(helpEmbed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "it seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name);

    if (!command) {
      return message.reply("That's not a valid command!");
    }

    const helpCommandEmbed = new Discord.MessageEmbed()
      .setColor("#ed1c24")
      .setTitle(`Help For Command ${command.name}`)
      .setAuthor(message.client.user.username, message.client.user.avatarURL())
      .setDescription(`Usage for command ${command.name}.`)
      .addFields(
        { name: "Command Name", value: command.name },
        { name: "Description", value: command.description },
        { name: "Usage", value: `${prefix}${command.name} ${command.usage}` }
      );

    if (!command.usage) {
      helpCommandEmbed.addField("Usage", `${prefix}${command.name}`);
    } else {
      helpCommandEmbed.addField("Usage", `${prefix}${command.name}`);
    }

    message.channel.send(helpCommandEmbed);
  },
};
