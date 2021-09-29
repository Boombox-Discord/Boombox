import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { token, clientID } from '../config.js';
import { Command } from './types/Command.js';
import { readdirSync } from 'fs';

const commands = [];
const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: Command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

async function main() {
  try {
    console.log('Started refreshing application commands.');

    await rest.put(Routes.applicationCommands(clientID), { body: commands });

    console.log('Successfully reloaded application commands.');
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

main();