const mysql = require("mysql");
const mysql_login = require("./Config").mysql;
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

const _ = {};

_.data = new Map();

_.get = guild => {
    return new Promise((resolve, reject) => {
        if (!guild) return resolve(DefaultData);
        if (_.data.has(guild.id)) {
            return resolve(_.data.get(guild.id));
        } else {
            connection.query(`SELECT * FROM servers WHERE id = ${mysql.escape(guild.id)}`, (error, rows) => {
                if (error) return resolve(DefaultData);
                if (!rows[0]) {
                    _.create(guild);
                    return resolve(DefaultData);
                } else {
                    _.data.set(guild.id, rows[0]);
                    return resolve(rows[0]);
                }
            });
        }
    });
};

_.create = guild => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO servers SET ?`, {"id": guild.id}, (error, result) => {
            if (error) return reject(error);
            _.data.set(guild.id, DefaultData);
            resolve();
        });
    });
};

_.update = (guild, setting, value) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE servers SET ${setting} = ${value ? mysql.escape(value) : `NULL`} WHERE id = ${guild.id}`, (error, result) => {
            if (error) return reject(error);
            _.data.get(guild.id)[setting] = value;
            return resolve();
        });
    });
};

module.exports = _;
