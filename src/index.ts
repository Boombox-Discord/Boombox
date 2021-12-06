import * as Sentry from '@sentry/node';

import { token, sentryDSN, sentryEnv } from '../config.json';
import { Client, ClientNew } from './client.js';

const client = new Client(
  "../",
  "build/src/commands",
  "build/src/events",
  "build/src/manager_events",
);

const clientnew = new ClientNew()

Sentry.init({
  dsn: sentryDSN,
  tracesSampleRate: 1.0,
  environment: sentryEnv,
});

async function main() {
  try {
    clientnew.logger.info('Logging in');
    await clientnew.login(token);
    clientnew.logger.info('Logged in')
  } catch (error) {
    client.destroy();
    Sentry.captureException(error);
    process.exit(1);
  }
}

main();
