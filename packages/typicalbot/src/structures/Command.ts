import { Client } from 'discord.js';
import Constants from '../utility/Constants';
import { CommandOptions } from '../types/typicalbot';

export default class Command {
    client: Client;
    name: string;
    path: string;
    description: string;
    usage: string;
    aliases: string[];
    dm: boolean;
    permission: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    mode: 0 | 1 | 2;
    access: 0 | 1 | 3;

    constructor(
        client: Client,
        name: string,
        path: string,
        options: CommandOptions
    ) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.description = options.description || 'Description Not Provided';
        this.usage = options.usage || 'Usage Not Provided';
        this.aliases = options.aliases || [];
        this.dm = options.dm || false;
        this.permission =
            options.permission || Constants.PermissionsLevels.SERVER_MEMBER;
        this.mode = options.mode || Constants.Modes.FREE;
        this.access = options.access || Constants.AccessLevels.DEFAULT;
    }
}
