import { Event } from '../types/Event';

export default class Ready extends Event {
  run = async (): Promise<void> => {
    console.log(`Logged in as ${this.client.user.tag}!`);
    this.client.manager.init(this.client.user.id);
    this.client.user.setActivity('for /help', { type: 'WATCHING' });
  };
}
