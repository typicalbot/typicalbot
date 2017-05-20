const mysql = require("mysql");
const vr = require("../../version").version;
const credentials = require(`../../Configs/${vr}`).mysql;

class Database {
    constructor() {
        this.connection = mysql.createConnection(credentials);

        this.connection.connect();
    }

    reconnect() {
        this.connection.end();

        this.connection = mysql.createConnection(credentials);
        this.connection.connect();
    }

    query(query) {
        return new Promise((resolve, reject) => {
            if (this.connection.state !== "authenticated") this.reconnect();

            this.connection.query(query, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    }
}

module.exports = Database;
