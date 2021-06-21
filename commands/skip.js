module.exports = {
  name: "skip",
  description: "Skips the current playing song.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(message, args) {
    const manager = message.client.manager;
    const player = manager.get(message.guild.id);

    if (!player) {
      return message.reply("There is currently not song playing!");
    }

    return player.stop();
  },
};
