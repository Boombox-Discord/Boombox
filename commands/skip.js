"use strict";
module.exports = {
  name: "skip",
  description: "Skips the current playing song.",
  args: false,
  guildOnly: true,
  voice: true,
  execute(interaction) {
    const manager = interaction.client.manager;
    const player = manager.get(interaction.guildID);

    if (!player) {
      return interaction.reply("There is currently not song playing!");
    }

    interaction.reply('I have skipped to the next song!')

    return player.stop();
  },
};
