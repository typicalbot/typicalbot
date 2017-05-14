const mysql = require("mysql");
const vr = require("../../version").version;
const credentials = require(`../../Configs/${vr}`).mysql;

class Database extends mysql.createConnection {
    constructor() {
        super(credentials);

        this.connect();
    }

    reconnect() {
        this.connect();
    }

    query(query) {
        return new Promise((resolve, reject) => {
            if (this.state !== "authenticated") this.reconnect();

            super.query(query, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    }
}

module.exports = Database;
