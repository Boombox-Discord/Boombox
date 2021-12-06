import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import { Collection, StageChannel, TextChannel, VoiceChannel } from 'discord.js';
import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';

import { Command } from './types/Command.js';
import { Event } from './types/Event.js';
import { Client as DiscordClient } from 'discord.js';
import {LogLevel, SapphireClient} from '@sapphire/framework';
import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';
import '@sapphire/plugin-logger/register';
import {
  redisIP, redisPort, redisUser, redisPassword, lavalinkNodes,
  spotifyClientID,
  spotifyClientSecret,
  prefix
} from '../config.json';

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  manager: Manager;
  redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(
    relativePath: string,
    commandsPath: string,
    eventsPath: string,
    managerEventsPath: string,
  ) {
    super({
      shards: 'auto',
      intents: [
        'GUILDS',
        'GUILD_VOICE_STATES',
        'DIRECT_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
      ]
    });
    this.redis = createClient({
      socket: {
        url: `redis://${redisUser}@${redisPassword}${redisIP}:${redisPort}`
      }
    });
    (async () => {

      this.redis.on('error', (err) => console.log('Redis Client Error', err));

      await this.redis.connect();
    })();


    this.commands = new Collection();

    // discord.js
    this.loadCommands(commandsPath, relativePath);
    this.loadEvents(eventsPath, relativePath);

    // lavalink
    this.startManager();
    this.loadManagerEvents(managerEventsPath, relativePath);
  }

  private loadCommands(commandsPath: string, relativePath: string) {
    readdirSync(commandsPath).forEach((dir) => {
      if (statSync(join(commandsPath, dir)).isDirectory()) {
        const commandFiles = readdirSync(`${commandsPath}/${dir}`).filter((f) =>
          f.endsWith('.ts')
        );

        for (const file of commandFiles) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const FoundCommand = require(join(
            relativePath,
            `commands/${dir}/${file}`
          )).default;
          const command: Command = new FoundCommand(this);

          console.log(`Loaded command ${dir}/${file}`);
          this.commands.set(command.name, command);
        }
      }
    });
  }

  private loadEvents(eventsPath: string, relativePath: string) {
    const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith('.ts'));
    for (const file of eventFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const FoundEvent = require(join(relativePath, `events/${file}`)).default;
      const event: Event = new FoundEvent(this);
      const eventFileName = file.split('.')[0];
      const eventName =
        eventFileName.charAt(0).toLowerCase() + eventFileName.slice(1);
      console.log(`Loaded event ${eventName}`);
      this.on(eventName, (...args: unknown[]) => {
        event.run(args);
      });
    }
  }

  private loadManagerEvents(managerEventsPath: string, relativePath: string) {
    const eventFiles = readdirSync(managerEventsPath).filter((f) => f.endsWith('.ts'));
    for (const file of eventFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const FoundEvent = require(join(relativePath, `events/${file}`)).default;
      const event: Event = new FoundEvent(this);
      const eventFileName = file.split('.')[0];
      const eventName =
        eventFileName.charAt(0).toLowerCase() + eventFileName.slice(1);
      console.log(`Loaded event ${eventName}`);
      this.manager.on(eventName, (...args: unknown[]) => {
        event.run(args);
      });
    }
  }

  private startManager() {
    this.manager = new Manager({
      nodes: lavalinkNodes,

      // plugins: [
      //   new Spotify({
      //     clientID: spotifyClientID,
      //     clientSecret: spotifyClientSecret,
      //   }),
      // ],
      send(id, payload) {
        const guild = this.guilds.cache.get(id);
        if (guild) {
          guild.shard.send(payload);
        }
      },
    });
  }

  /**
     * Check if the bot has permissions to play in the voice channel.
     *
     * @param voiceChannel the voice channel to join
     * @returns a string with the issue preventing the bot from connecting, else
     *          null if there are no issues
     */
  hasPermissionsJoin(voiceChannel: VoiceChannel | StageChannel): string {
    const permissions = voiceChannel.permissionsFor(this.user);
    if (!permissions.has("CONNECT")) {
      return "I need the permissions to join your voice channel!";
    } else if (!permissions.has("SPEAK")) {
      return "I need the permissions to speak in your voice channel!";
    }
    return null;
  }

  /**
   * 
   * Check if the bot has permissions to send a message in the channel.
   * 
   * @param textChannel the text channel to send the message in
   * @returns a string with the issue preventing the bot from sending a message, else
   *          null if there are no issues
   */
  hasPermissionsSend(textChannel: TextChannel): string {
    const permissions = textChannel.permissionsFor(this.user);
    if (!permissions.has("SEND_MESSAGES")) {
      return "I need the permissions to send messages in this channel!";
    } else if (!permissions.has("EMBED_LINKS")) {
      return "I need the permissions to send embeds in this channel!";
    } else if (!permissions.has("VIEW_CHANNEL")) {
      return "I need the permissions to view this channel!";
    }
    return null;
  }
}


export class ClientNew extends SapphireClient {
  constructor() {
    super({
      defaultPrefix: prefix,
      caseInsensitiveCommands: true,
      logger: {
        level: LogLevel.Debug
      },
      intents: [
        'GUILDS',
        'GUILD_VOICE_STATES',
        'DIRECT_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
      ]
    })
  }
}