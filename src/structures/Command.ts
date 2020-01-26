import Constants from '../utility/Constants';
import {
    CommandOptions,
    TypicalGuildMessage,
    PermissionLevel
} from '../types/typicalbot';
import Cluster from '..';
import { Message } from 'discord.js';

export default class Command {
    client: Cluster;
    name: string;
    path: string;
    description: string;
    usage: string;
    aliases: string[];
    dm: boolean;
    permission: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    mode: 0 | 1 | 2;
    access: 0 | 1 | 3;
    ptb = false;

    constructor(
        client: Cluster,
        name: string,
        path: string,
        options?: CommandOptions
    ) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.aliases = (options && options.aliases) || [];
        this.dm = (options && options.dm) || false;
        this.permission =
            (options && options.permission) ||
            Constants.PermissionsLevels.SERVER_MEMBER;
        this.mode = (options && options.mode) || Constants.Modes.FREE;
        this.access =
            (options && options.access) || Constants.AccessLevels.DEFAULT;
        this.ptb = (options && options.ptb) || false;
    }

    execute(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _message: Message | TypicalGuildMessage,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _params?: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _permissions?: PermissionLevel
    ) {
        throw 'Silly you, how does your command execute without an execute method?';
    }
}
