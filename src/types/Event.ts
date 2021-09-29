import { Client } from '../client.js';

export abstract class Event {
  client: Client;

  abstract run: (args?: unknown) => void;

  constructor(client: Client) {
    this.client = client;
  }
}
