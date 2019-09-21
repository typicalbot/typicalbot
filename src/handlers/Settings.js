const { Collection } = require('discord.js');

const DefaultSettings = require('../structures/Settings.js');

class SettingHandler extends Collection {
    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });
    }

    async fetch(id) {
        if (this.has(id)) return this.get(id);

        const row = await this.client.handlers.database.get('guilds', id);

        if (!row) {
            this.create(id);
            return DefaultSettings(id);
        }

        this.set(id, row);
        return row;
    }

    async create(id) {
        const newData = DefaultSettings(id);

        await this.client.handlers.database.insert('guilds', newData);
        this.set(id, newData);

        return newData;
    }

    _update(target, source) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && !(source[key] instanceof Array)) {
                target[key] = this._update(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }

        return target;
    }

    async update(id, object) {
        await this.client.handlers.database.update('guilds', id, object);
        await this.set(id, this._update(this.get(id), object));
    }

    async delete(id) {
        await this.client.handlers.database.delete('guilds', id);
        super.delete(id);
    }
}

module.exports = SettingHandler;
