const mysql = require("mysql");
const mysql_login = require("./Config").mysql;
const connection = mysql.createConnection(mysql_login);
connection.connect();

let GuildData = new Map();

const DefaultData = {
    "masterrole": null,
    "joinrole": null,
    "silent": "N",
    "blacklist": null,
    "djrole": null,
    "announcement": null,
    "joinann": null,
    "leaveann": null,
    "banann": null,
    "unbanann": null,
    "nickann": null,
    "inviteann": null,
    "joinmessage": null,
    "joinnick": null,
    "mode": "free",
    "customprefix": null,
    "originaldisabled": "N",
    "antiinvite": "N",
    "invitekick": "N",
    "modlogs": null,
    "antilink": "N",
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
};

module.exports = class Database {
    get data() {
        return GuildData;
    }

    get(guild) {
        return new Promise((resolve, reject) => {
            if (!guild) return resolve(DefaultData);
            if (GuildData.has(guild.id)) {
                return resolve(GuildData.get(guild.id));
            } else {
                connection.query(`SELECT * FROM servers WHERE id = ${mysql.escape(guild.id)}`, (error, rows) => {
                    if (error) return resolve(DefaultData);
                    if (!rows[0]) {
                        this.create(guild);
                        return resolve(DefaultData);
                    } else {
                        GuildData.set(guild.id, rows[0]);
                        return resolve(rows[0]);
                    }
                });
            }
        });
    }

    create(guild) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO servers SET ?`, {"id": guild.id}, (error, result) => {
                if (error) return reject(error);
                GuildData.set(guild.id, DefaultData);
                resolve();
            });
        });
    }

    update(guild, setting, value) {
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE servers SET ${setting} = ${value ? mysql.escape(value) : `NULL`} WHERE id = ${guild.id}`, (error, result) => {
                if (error) return reject(error);
                GuildData.get(guild.id)[setting] = value;
                return resolve();
            });
        });
    }
};
