const Function = require("../structures/Function");
const request = require("superagent");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    sendCarbonitex() {
        request.post("https://www.carbonitex.net/discord/data/botdata.php")
            .set("Content-Type", "application/json")
            .send({
                "shardid": this.client.shardID.toString(),
                "shardcount": this.client.shardCount.toString(),
                "servercount": this.client.guilds.size.toString(),
                "key": this.client.config.apis.carbon
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) this.client.handlers.process.log(`Carbinitex Stats Transfer Failed ${err.body || err}`, true);
            });
    }

    sendDiscordBots() {
        request.post(`https://discordbots.org/api/bots/${this.client.config.id}/stats`)
            .set("Content-Type", "application/json")
            .set("Authentication", this.client.config.apis.discordbots)
            .send({
                "shard_id": this.client.shardID.toString(),
                "shard_count": this.client.shardCount.toString(),
                "server_count": this.client.guilds.size.toString()
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) this.client.handlers.process.log(`DiscordBots Stats Transfer Failed ${err.body || err}`, true);
            });
    }

    execute(provider) {
        if (provider === "a") {
            this.sendCarbonitex();
            this.sendDiscordBots();
        } else if (provider === "c") this.sendCarbonitex();
        else if (provider === "b") this.sendDiscordBots();
    }
}

module.exports = New;
