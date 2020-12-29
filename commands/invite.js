const { Metrics } = require("../utils/utils");

const { inviteLink } = require("../config.json"); //skipcq: JS-0266

function invite(msg, client) {
  Metrics.increment("boombox.invite");
  return msg.channel.send({
    embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: "Click here to add Boombox to your server.",
      url: inviteLink,
      color: 16711680,
    },
  });
}

module.exports = invite;
