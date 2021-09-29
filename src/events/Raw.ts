import { VoicePacket } from 'erela.js';
import { Event } from '../types/Event.js';

export default class Raw extends Event {
  run = async (d: VoicePacket): Promise<void> => {
    this.client.manager.updateVoiceState(d);
  };
}
