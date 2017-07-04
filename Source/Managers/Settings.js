const { Collection } = require("discord.js");

const DefaultData = 1;

class Settings {
    constructor(client) {
        this.client = client;

        this.data = new Collection();

        this.default = DefaultData;
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

    fetch(id) {
        return new Promise((resolve, reject) => {
            if (this.data.has(id)) return resolve(this.data.get(id));

            this.client.database.get("guilds", id).then(row => {
                if (!row) {
                    this.create(id);
                    return resolve(this._defaultData(id));
                }

                this.data.set(id, row);
                return resolve(row);
            }).catch(err => {
                return resolve(this._defaultData(id));
            });
        });
    }

    create(id) {
        return new Promise((resolve, reject) => {
            const newData = this._defaultData(id);

            this.client.database.insert("guilds", newData).then(result => {
                this.data.set(id, newData);
                return resolve(newData);
            }).catch(err => {
                return resolve(newData);
            });
        });
    }

    update(id, setting, value) {
        return new Promise((resolve, reject) => {
            this.client.database.update("guilds", id, setting, value).then(result => {
                this.data.get(id)[setting] = value;
                return resolve();
            }).catch(err => {
                return reject(err);
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.client.database.delete("guilds", id).then(result => {
                this.data.delete(id);
                return resolve();
            }).catch(err => {
                return reject();
            });
        });
    }
}

module.exports = Settings;
