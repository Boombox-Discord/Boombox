import { Node } from 'erela.js';
import { Event } from '../types/Event.js';

export default class NodeError extends Event {
    run = async (node: Node, error: Error): Promise<void> => {
        console.log(`Node ${node.options.identifier} had an error: ${error.message}`)
    }
}