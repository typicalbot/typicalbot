import { Collection } from 'discord.js';
import TypicalClient from '../lib/TypicalClient';
import DefaultSettings from '../lib/structures/Settings';
import { GuildSettings } from '../lib/types/typicalbot';

export default class SettingHandler extends Collection<string, GuildSettings> {
    client: TypicalClient;
    constructor(client: TypicalClient) {
        super();
        this.client = client;
    }

    async fetch(id: string) {
        if (this.has(id)) return this.get(id) as GuildSettings;

        const row = (await this.client.handlers.database.get('guilds', { id: id })) as GuildSettings;

        if (!row) return this.create(id);

        this.set(id, row);
        return row;
    }

    async create(id: string) {
        const payload = DefaultSettings(id) as GuildSettings;

        await this.client.handlers.database.insert('guilds', payload);
        this.set(id, payload);

        return payload;
    }

    async update(id: string, payload = {}) {
        // TODO: Refactor this to remove extra query
        this.client.handlers.database.update('guilds', { id: id }, payload);

        const row = (await this.client.handlers.database.get('guilds', { id: id })) as GuildSettings;
        this.set(id, row);

        return true;
    }
}
