const { Metrics } = require("../utils/utils");

const { prefix } = require("../config.json"); //skipcq: JS-0266

function help(msg, client) {
  Metrics.increment("boombox.help");
  const helpTitle = client.user.username + " help";

  return msg.channel.send({
    embed: {
      title: helpTitle,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      color: 16711680,
      fields: [
        {
          name: `${prefix}help`,
          value: "Displays this command",
        },
        {
          name: `${prefix}play [song name or url]`,
          value:
            "This command will play a song. If a song is currently playing it will add it to the queue. You can type a song name or paste a link to the YouTube video.",
        },
        {
          name: `${prefix}playlist [youtube playlist url]`,
          value:
            "This command will add all songs from a youtube playlist into the queue.",
        },
        {
          name: `${prefix}skip`,
          value: "Will skip the current song.",
        },
        {
          name: `${prefix}stop`,
          value: "Will stop all music and delete the queue.",
        },
        {
          name: `${prefix}np`,
          value: "Displays what song is currently playing.",
        },
        {
          name: `${prefix}lyrics`,
          value:
            "Will get the currently playing songs lyrics. Lyrics are provided by Genius.",
        },
        {
          name: `${prefix}lyrics [song name]`,
          value:
            "Will get the lyrics for the provided song. Lyrics are provided by Genius.",
        },
        {
          name: `${prefix}queue`,
          value: "Displays current queue.",
        },
        {
          name: `${prefix}volume`,
          value: "Set's the volume. Use a number between 1 and 100.",
        },
        {
          name: `${prefix}invite`,
          value: "Sends an invite link for the bot.",
        },
        {
          name: `${prefix}pause`,
          value: "Will pause the currently playing song.",
        },
        {
          name: `${prefix}remove [position in queue]`,
          value: "Will remove that song from the queue.",
        },
      ],
    },
  });
}

module.exports = help;
