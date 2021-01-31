import { Message } from 'discord.js';
import Cluster from '../TypicalClient';
import {
    CommandOptions,
    TypicalGuildMessage,
    PermissionLevel
} from '../types/typicalbot';
import { PERMISSION_LEVEL, MODE, ACCESS_LEVEL } from '../utils/constants';

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
    category: string;

    constructor(client: Cluster, name: string, path: string, options?: CommandOptions) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.category = path.substring(path.indexOf(process.platform === 'win32' ? 'commands\\' : 'commands/') + 9, path.length - (name.length + 4));
        this.aliases = (options?.aliases) ?? [];
        this.dm = (options?.dm) ?? false;
        this.permission =
            (options?.permission) ??
            PERMISSION_LEVEL.SERVER_MEMBER;
        this.mode = (options?.mode) ?? MODE.FREE;
        this.access =
            (options?.access) ?? ACCESS_LEVEL.DEFAULT;
        this.ptb = (options?.ptb) ?? false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(_message: Message | TypicalGuildMessage, _params?: string, _permissions?: PermissionLevel) {
        throw new Error('Unsupported operation.');
    }
}
