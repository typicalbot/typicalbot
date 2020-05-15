import { Message } from 'discord.js';
import Cluster from '../TypicalClient';
import {
    CommandOptions,
    TypicalGuildMessage,
    PermissionLevel
} from '../types/typicalbot';
import { PermissionsLevels, Modes, AccessLevels } from '../utils/constants';

export default class Command {
    client: Cluster;
    name: string;
    path: string;
    aliases: string[];
    dm: boolean;
    permission: -1 | 0 | 2 | 3 | 4 | 10;
    mode: 0 | 1 | 2;
    access: 0 | 1 | 3;
    ptb = false;

    constructor(client: Cluster, name: string, path: string, options?: CommandOptions) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.aliases = (options && options.aliases) || [];
        this.dm = (options && options.dm) || false;
        this.permission =
            (options && options.permission) ||
            PermissionsLevels.SERVER_MEMBER;
        this.mode = (options && options.mode) || Modes.FREE;
        this.access =
            (options && options.access) || AccessLevels.DEFAULT;
        this.ptb = (options && options.ptb) || false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(_message: Message | TypicalGuildMessage, _params?: string, _permissions?: PermissionLevel) {
        throw 'Unsupported operation.';
    }
}
