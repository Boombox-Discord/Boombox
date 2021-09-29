import * as Sentry from '@sentry/node';

import { token, sentryDSN, sentryEnv } from '../config.js';
import { Client } from './client.js';

const client = new Client(
  "../",
  "build/src/commands",
  "build/src/events",
  "build/src/manager_events",
);

Sentry.init({
  dsn: sentryDSN,
  tracesSampleRate: 1.0,
  environment: sentryEnv,
});

async function main() {
  try {
    await client.login(token);
  } catch (error) {
    client.destroy();
    Sentry.captureException(error);
    process.exit(1);
  }
}

main();
