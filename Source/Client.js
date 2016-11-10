const ShardID = process.env.SHARD_ID;
const ShardCount = process.env.SHARD_COUNT;

let Config = require("./Config");

const Discord = require("discord.js");

let cmdh = require("./CommandHandler");
let fn = require("./Functions");
let ev = require("./Events");
let music = require("./MusicUtil");
let db = require("./Database");

let MusicQueue = new Map();

class Client {
    constructor() {
        this.ShardID = ShardID;
        this.ShardCount = ShardCount;
        this.data = {};

        this.setup();
    }

    setup() {
        let bot = this.bot = new Discord.Client({"shardId": parseInt(ShardID), "shardCount": parseInt(ShardCount)});
        bot.login(Config.token).catch(err => this.events.error(err));

        bot
            .on("ready", () => {
                this.events.ready();
                setInterval(() => this.events.intervalStatus(), 60000);
                setInterval(() => this.events.intervalPost(), 1200000);
                setInterval(() => this.sendStat("voiceConnections"), 10000);
                setInterval(() => {
                    process.send({"type": "stat", "data": {"heap": process.memoryUsage().heapUsed/1024/1024}});
                }, 5000);
            })
            .on("warn", console.error)
            .on("error", console.error)
            .on("reconnecting", () => console.error("Reconnecting"))
            .on("disconnect", () => console.error("Disconnected"))
            .on("message", this.events.message)
            .on("guildMemberAdd", this.events.guildMemberAdd)
            .on("guildMemberRemove", this.events.guildMemberRemove)
            .on("guildBanAdd", this.events.guildBanAdd)
            .on("guildBanRemove", this.events.guildBanRemove)
            .on("guildMemberUpdate", this.events.guildMemberUpdate)
            .on("guildCreate", this.events.guild)
            .on("guildDelete", this.events.guild);

        this.commands = new cmdh();
        this.functions = new fn(this);
        this.events = new ev(this);
        this.music = new music(this);
        this.settings = new db();
    }

    log(data) {
        console.log(`SHARD ${ShardID} | ${data}`);
    }

    send(type, key, data) {
        process.send({"type": type, [key]: data});
    }

    sendStat(stat) {
        let value = this.bot[stat].size;
        process.send({"type": "stat", "data": {[stat]: value}});
    }

    reload(mod) {
        let all = mod === "all";
        if (all || mod === "config") {
            delete require.cache[`${__dirname}/Config.json`];
            Config = require("./Config");
        }
        if (all || mod === "commands") {
            this.commands.reload();
        }
        if (all || mod === "functions") {
            delete require.cache[`${__dirname}/Functions.js`];
            fn = require("./Functions");
            this.functions = new fn(this);
        }
        if (all || mod === "events") {
            delete require.cache[`${__dirname}/Events.js`];
            ev = require("./Events");
            this.events = new ev(this);
        }
        if (all || mod === "music") {
            delete require.cache[`${__dirname}/MusicUtil.js`];
            music = require("./MusicUtil");
            this.music = new music(this);
        }
    }

    get streams() {
        return MusicQueue;
    }

    get config() {
        return Config;
    }
}

module.exports = this;
