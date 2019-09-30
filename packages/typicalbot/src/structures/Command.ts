import Constants from '../utility/Constants';
import { CommandOptions } from '../types/typicalbot';
import Cluster from '..';

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

    constructor(
        client: Cluster,
        name: string,
        path: string,
        options?: CommandOptions
    ) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.description =
            (options && options.description) || 'Description Not Provided';
        this.usage = (options && options.usage) || 'Usage Not Provided';
        this.aliases = (options && options.aliases) || [];
        this.dm = (options && options.dm) || false;
        this.permission =
            (options && options.permission) ||
            Constants.PermissionsLevels.SERVER_MEMBER;
        this.mode = (options && options.mode) || Constants.Modes.FREE;
        this.access =
            (options && options.access) || Constants.AccessLevels.DEFAULT;
    }
}
