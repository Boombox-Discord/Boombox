class BoomboxErrors extends Error {
  constructor(msg, command, client, args, errorChannel) {
    super(msg, command, client, args, errorChannel);
    this.name = "Boombox Error";
    msg.channel.send(
      "Sorry an error has occured. Please try again later, or submit a bug report on our support server."
    );
    client.channels.cache.get(errorChannel).send({
      embed: {
        color: 16711680,
        timestamp: msg.createdAt,
        author: {
          name: msg.author.username,
          icon_url: msg.author.avatarURL,
        },
        fields: [
          {
            name: "Command",
            value: command,
          },
          {
            name: "Traceback",
            value: "```" + Error().stack + "```",
          },
        ],
      },
    });
  }
}

module.exports = BoomboxErrors;
