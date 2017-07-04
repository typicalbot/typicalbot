const mysql = require("mysql");
const { Collection } = require("discord.js");

const DefaultData = {
    "embed": "N",
    "masterrole": null,
    "modrole": null,
    "joinrole": null,
    "silent": "N",
    "blacklist": null,
    "publicroles": null,
    "announcements": null,
    "logs": null,
    "joinlog": null,
    "leavelog": null,
    "banlog": null,
    "unbanlog": null,
    "nicklog": null,
    "invitelog": null,
    "joinmessage": null,
    "joinnick": null,
    "mode": "free",
    "customprefix": null,
    "originaldisabled": "N",
    "antiinvite": "N",
    "invitekick": "N",
    "modlogs": null,
    "antilink": "N",
    "nonickname": "Y",
    "musicperms": "all",
    "orplay": "off",
    "orskip": "off",
    "orstop": "off",
    "orunqueue": "off",
    "orvolume": "off",
    "orpause_resume": "off",
    "lengthlimit": null,
    "queuelimit": null,
    "apikey": null,
    "mentionlimit": null
};

class Settings {
    constructor(client) {
        this.client = client;

        this.data = new Collection();

        this.default = DefaultData;
    }

    fetch(id) {
        return new Promise((resolve, reject) => {
            if (this.data.has(id)) {
                const data = this.data.get(id);
                if (data.id !== id) {
                    this.data.delete(id);
                    return this.fetch(id);
                } else return resolve(data);
            } else {
                this.client.database.query(`SELECT * FROM guilds WHERE id = ${id}`).then(rows => {
                    if (!rows.length) {
                        this.create(id);
                        return resolve(DefaultData);
                    } else {
                        this.data.set(id, rows[0]);
                        return resolve(rows[0]);
                    }
                }).catch(err => {
                    console.error(err);
                    return resolve(DefaultData);
                });
            }
        });
    }

    create(id) {
        return new Promise((resolve, reject) => {
            this.client.database.query(`INSERT INTO guilds (id) VALUES (${mysql.escape(id)})`).then(result => {
                this.data.set(id, DefaultData);
                return resolve();
            }).catch(err => {
                return reject();
            });
        });
    }

    update(id, setting, value) {
        return new Promise((resolve, reject) => {
            this.client.database.query(`UPDATE guilds SET ${setting} = ${value ? mysql.escape(value) : `NULL`} WHERE id = ${id}`).then(result => {
                this.data.get(id)[setting] = value;
                return resolve();
            }).catch(err => {
                return reject();
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.client.database.query(`DELETE FROM guilds WHERE id = ${id}`).then(result => {
                this.data.delete(id);
                return resolve();
            }).catch(err => {
                return reject();
            });
        });
    }

    valueSettings(guild) {
        return new Promise(async (resolve, reject) => {
            const settings = await this.fetch(guild.id);


        });
    }
}

module.exports = Settings;
