const mysql = require("mysql");
const vr = require("../../version").version;
const mysql_login = require(`../../Configs/${vr}`).mysql;

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
    constructor() {
        this.connect();

        this.data = new Map();

        this.default = DefaultData;
    }

    connect() {
        if (this.connection) this.connection.end();

        this.connection = mysql.createConnection(mysql_login);
        this.connection.connect();
    }

    fetch(id) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            if (!id) return resolve(DefaultData);
            if (this.data.has(id)) {
                let data = this.data.get(id);
                if (data.id !== id) {
                    this.data.delete(id);
                    return this.get(id);
                } else return resolve(data);

                //return resolve(data);
            } else {
                this.connection.query(`SELECT * FROM guilds WHERE id = ${id}`, (error, rows) => {
                    if (error) return resolve(DefaultData);
                    if (!rows[0]) {
                        this.create(id);
                        return resolve(DefaultData);
                    } else {
                        this.data.set(id, rows[0]);
                        return resolve(rows[0]);
                    }
                });
            }
        });
    }

    create(id) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            this.connection.query(`INSERT INTO guilds SET ?`, { id }, (error, result) => {
                if (error) return reject(error);
                this.data.set(id, DefaultData);
                resolve();
            });
        });
    }

    update(id, setting, value) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            this.connection.query(`UPDATE guilds SET ${setting} = ${value ? mysql.escape(value) : `NULL`} WHERE id = ${id}`, (error, result) => {
                if (error) return reject(error);
                this.data.get(id)[setting] = value;
                return resolve();
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            this.connection.query(`DELETE FROM guilds WHERE id = ${id}`, (error, result) => {
                if (error) return reject(error);
                this.data.delete(id);
                return resolve();
            });
        });
    }
}

module.exports = Settings;
