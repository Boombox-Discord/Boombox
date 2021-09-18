import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { token, clientID } from '../config.json';
import { Command } from './types/Command';
import { readdirSync } from 'fs';

const commands = [];
const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
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