require("./utility/Extenders");

const { Client, Collection } = require("discord.js");
const request = require("superagent");

const config = require("../../config.json");

const DatabaseHandler = require("./handlers/Database");
const TaskHandler = require("./handlers/Tasks");
const PermissionsHandler = require("./handlers/Permissions");
const ModerationLogHandler = require("./handlers/ModerationLog");
const MusicHandler = require("./handlers/Music");

const SettingHandler = require("./handlers/Settings");
const FunctionHandler = require("./handlers/Functions");
const CommandHandler = require("./handlers/Commands");
const EventHandler = require("./handlers/Events");

const MusicUtility = require("./utility/Music");

module.exports = class Cluster extends Client {
    constructor(node) {
        super({
            "messageCacheMaxSize": 150,
            "messageCacheLifetime": 3600,
            "messageSweepInterval": 300,
            "disableEveryone": true
        });

        this.node = node;
        this.config = config;
        this.build = config.build;

        this.shards = JSON.parse(process.env.SHARDS);
        this.cluster = `${process.env.CLUSTER} [${this.shards.join(",")}]`;
        this.shardCount = process.env.TOTAL_SHARD_COUNT;

        this.handlers = {};
        this.handlers.database = new DatabaseHandler(this);
        this.handlers.tasks = new TaskHandler(this);
        this.handlers.permissions = new PermissionsHandler(this);
        this.handlers.moderationLog = new ModerationLogHandler(this);
        this.handlers.music = new MusicHandler(this);

        this.settings = new SettingHandler(this);
        this.functions = new FunctionHandler(this);
        this.commands = new CommandHandler(this);
        this.events = new EventHandler(this);

        this.utility = {};
        this.utility.music = new MusicUtility(this);

        this.caches = {};
        this.caches.donors = new Collection();
        this.caches.bans = new Collection();
        this.caches.unbans = new Collection();
        this.caches.softbans = new Collection();
        this.caches.invites = new Collection();

        this.fetchDonors();

        this.login(this.config.token);
    }

    fetchData(property) {
        return this.node.sendTo("manager", {
            event: "collectData",
            data: property
        }, { receptive: true });
    }

    async fetchDonors() {
        (await this.handlers.database.connection.table("donors")).forEach(e => {
            if (e.id.length > 5) this.caches.donors.set(e.id, e);
        });

        return this.caches.donors;
    }

    get usedRAM() {
        return Math.round(process.memoryUsage().heapUsed / 1048576);
    }

    get totalRAM() {
        return Math.round(process.memoryUsage().heapTotal / 1048576);
    }

    async sendStatistics() {
        request.post("https://www.carbonitex.net/discord/data/botdata.php")
            .set("Content-Type", "application/json")
            .send({
                "shardid": this.shardID.toString(),
                "shardcount": this.shardCount.toString(),
                "servercount": this.guilds.size.toString(),
                "key": this.config.apis.carbon
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) throw `Carbinitex Stats Transfer Failed ${err.body || err}`;
            });

        request.post(`https://discordbots.org/api/bots/${this.user.id}/stats`)
            .set("Content-Type", "application/json")
            .set("Authorization", this.config.apis.discordbots)
            .send({
                "shard_id": this.shardID.toString(),
                "shard_count": this.shardCount.toString(),
                "server_count": this.guilds.size.toString()
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) throw `DiscordBots Stats Transfer Failed ${err.body || err}`;
            });
    }
};