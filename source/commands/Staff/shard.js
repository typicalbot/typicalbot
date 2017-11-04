const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            mode: "strict",
            permission: 9
        });
    }

    execute(message, response, permissionLevel) {
        const match = /shard\s+(ping|restart|\d+)\s*(\d+)?/i.exec(message.content);
        if (!match) return response.error("Invalid command usage.");

        const action = match[1];
        const shard = match[2];

        if (action === "ping") {
            if (!shard) return response.error("No shard specified.");

            shard < 100 ?
                this.client.transmit("shardping", { "channel": message.channel.id, shard, timestamp: Date.now() }) :
                this.client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${shard}&shard_count=${this.client.shardCount}`).then(data => {
                    this.client.transmit("shardping", { "channel": message.channel.id, "shard": +data, timestamp: Date.now() });
                });
        } else if (action === "restart") {
            if (shard || !shard) return response.error("Subcommand disabled.");

            if (!shard) return response.error("No shard specified.");

            shard < 100 ?
                this.client.transmit("restartshard", { shard }) :
                this.client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${shard}&shard_count=${this.client.shardCount}`).then(data => {
                    this.client.transmit("restartshard", { "shard": +data });
                });
        } else {
            this.client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${action}&shard_count=${this.client.shardCount}`).then(data => {
                response.reply(`Guild ${action} is on Shard ${+data + 1} / ${this.client.shardCount}.`);
            });
        }
    }
};
