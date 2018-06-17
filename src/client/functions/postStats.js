const Function = require("../structures/Function");
const request = require("superagent");

function sendCarbonitex(client) {
    request.post("https://www.carbonitex.net/discord/data/botdata.php")
        .set("Content-Type", "application/json")
        .send({
            "shardid": client.shardID.toString(),
            "shardcount": client.shardCount.toString(),
            "servercount": client.guilds.size.toString(),
            "key": client.config.apis.carbon
        })
        .end((err, res) => {
            if (err || res.statusCode != 200) throw `Carbinitex Stats Transfer Failed ${err.body || err}`;
        });
}

function sendDiscordBots(client) {
    request.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
        .set("Content-Type", "application/json")
        .set("Authorization", client.config.apis.discordbots)
        .send({
            "shard_id": client.shardID.toString(),
            "shard_count": client.shardCount.toString(),
            "server_count": client.guilds.size.toString()
        })
        .end((err, res) => {
            if (err || res.statusCode != 200) throw `DiscordBots Stats Transfer Failed ${err.body || err}`;
        });
}

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(provider) {
        if (provider === "a") {
            sendCarbonitex(this.client);
            sendDiscordBots(this.client);
        } else if (provider === "c") sendCarbonitex(this.client);
        else if (provider === "b") sendDiscordBots(this.client);
    }
}

module.exports = New;
