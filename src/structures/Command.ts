import { Client } from 'discord.js';
import Constants from '../utility/Constants';
import { CommandOptions } from '../types/typicalbot';

export default class Command {
  name: string;

  path: string;

  description: string;

  usage: string;

  aliases: string[];

  dm: boolean;

  permission: number;

  mode: number;

  access: number;

  constructor(client: Client, name: string, path: string, options: CommandOptions) {
      Object.defineProperty(this, 'client', { value: client });

      this.name = name;
      this.path = path;
      this.description = options.description || 'Description Not Provided';

      this.usage = options.usage || 'Usage Not Provided';

      this.aliases = options.aliases || [];

      this.dm = options.dm || false;

      this.permission = options.permission || Constants.PermissionsLevels.SERVER_MEMBER;

      this.mode = options.mode || Constants.Modes.FREE;

      this.access = options.access || Constants.AccessLevels.DEFAULT;
  }
}
