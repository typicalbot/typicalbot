const { MessageEmbed } = require("discord.js");

module.exports = class {
    constructor(client) { this.client = client; }

    async message(message) {
        const { type, data } = message;

        if (type === "stats") {
            this.client.shardData = data;
        } else if (type === "reload") {
            this.client.reload(data);
        } else if (type === "transmitTesters") {
            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        } else if (type === "testers") {
            this.client.testerData = data;
        } else if (type === "message") {
            if (!this.client.channels.has(data.channel)) return;

            const channel = this.client.channels.get(data.channel);
            const options = data.embed ? { embed: data.embed } : {};

            channel.send(data.content, options).catch(err => channel.send(`An error occued while executing an external message.`));
        } else if (type === "globaleval") {
            try { this.client.log(eval(data.code)); }
            catch(err) { this.client.log(err, true); }
        }
    }
};