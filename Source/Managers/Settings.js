const mysql = require("mysql");
const mysql_login = require("../../config.json").mysql;
const connection = mysql.createConnection(mysql_login);
connection.connect();

const DefaultData = {
    "masterrole": null,
    "modrole": null,
    "joinrole": null,
    "silent": "N",
    "blacklist": null,
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
};

class Settings {
    constructor() {
        this.connection = connection;
        
        this.data = new Map();
    }

    clear() {
        this.data.clear();
    }

    get(id) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            if (!id) return resolve(DefaultData);
            if (this.data.has(id)) {
                return resolve(this.data.get(id));
            } else {
                connection.query(`SELECT * FROM servers WHERE id = ${id}`, (error, rows) => {
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
            connection.query(`INSERT INTO servers SET ?`, { id }, (error, result) => {
                if (error) return reject(error);
                this.data.set(id, DefaultData);
                resolve();
            });
        });
    }

    update(id, setting, value) {
        return new Promise((resolve, reject) => {
            id = id ? typeof id === "object" ? id.id : id : null;
            connection.query(`UPDATE servers SET ${setting} = ${value ? mysql.escape(value) : `NULL`} WHERE id = ${id}`, (error, result) => {
                if (error) return reject(error);
                this.data.get(id)[setting] = value;
                return resolve();
            });
        });
    }
}

module.exports = Settings;
