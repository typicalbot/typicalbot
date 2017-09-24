const Discord = require("discord.js");
const { Collection } = Collection;

module.exports = class {
    constructor(client) {
        this.client = client;
        this.connection = client.settingsManager.connection;

        this.data = new Collection();

        this.collect();
    }

    collect() {
        this.conection.query("SELECT * FROM pcs", (error, rows) => {
            if (error ||  !rows.length) return;

            rows.forEach(r => {
                if (this.data.has(r.id)) return this.data.set(this.data.get(r.id).push(r));
                return this.data.set([r]);
            });
        });
    }

    match(guild, text) {
        if (!list.has(guild)) return;
        const list = this.data.get(guild);

        const key = list.filter(d => d.trigger === text)[0];
        return key;
    }
};
