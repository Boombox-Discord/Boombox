import { Client } from './client';
import { token } from './config.json';

const client = new Client()

async function main() {
  try {
    client.logger.info('Logging in');
    await client.login(token);
    client.logger.info('Logged in');
  } catch (error) {
    client.destroy();
    process.exit(1);
  }
}

main();