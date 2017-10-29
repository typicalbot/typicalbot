const Store = require("../structures/Store");
const path = require("path");

class EventStore extends Store {
    constructor(client) {
        super(client, "settings");
    }

    _defaultData(id) {
        return {
            id,
            "embed": false,
            "roles": {
                "administrator": [],
                "moderator": [],
                "dj": [],
                "blacklist": [],
                "public": []
            },
            "ignored": {
                "commands": [],
                "invies": []
            },
            "announcements": {
                "id": null,
                "mention": null
            },
            "logs": {
                "id": null,
                "join": null,
                "leave": null,
                "ban": null,
                "unban": null,
                "delete": null,
                "nickname": null,
                "invite": null,
                "moderation": null
            },
            "auto": {
                "role": {
                    "id": null,
                    "delay": null,
                    "silent": true
                },
                "message": null,
                "nickname": null
            },
            "mode": "free",
            "prefix": {
                "custom": null,
                "default": true
            },
            "automod": {
                "invite": false,
                "link": false
            },
            "nonickname": true,
            "music": {
                "default": "all",
                "play": "off",
                "skip": "off",
                "stop": "off",
                "unqueue": "off",
                "volume": "off",
                "pause-resume": "off",
                "timelimit": null,
                "queuelimit": null,
                "apikey": null
            }
        };
    }

    async fetch(id) {
        if (this.has(id)) return this.get(id);

        const row = await this.client.database.get("guilds", id);

        if (!row) {
            this.create(id);
            return this._defaultData(id);
        }

        this.set(id, row);
        return row;
    }

    async create(id) {
        const newData = this._defaultData(id);

        await this.client.database.insert("guilds", newData);
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
        await this.client.database.update("guilds", id, object);
        await this.set(id, this._update(this.get(id), object));

        return;
    }

    async delete(id) {
        await this.client.database.delete("guilds", id);
        super.delete(id);

        return;
    }
}

module.exports = EventStore;
