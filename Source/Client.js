const ShardID = process.env.SHARD_ID;
const ShardCount = process.env.SHARD_COUNT;

let Config = require("./Config");

const Discord = require("discord.js");
const DiscordBot = new Discord.Client({"shardId": parseInt(ShardID), "shardCount": parseInt(ShardCount)});

let CommandHandler = require("./CommandHandler");
let Functions = require("./Functions"), functions;
let Events = require("./Events"), events;
let MusicUtil = require("./MusicUtil"), musicutil;
let Database = require("./Database"), database;

let MusicQueue = new Map();

class Client {
    constructor() {
        this.ShardID = ShardID;
        this.ShardCount = ShardCount;
        this.data = {};

        this.setup();
    }

    setup() {
        DiscordBot.login(Config.token).catch(err => this.events.error(err));
        CommandHandler = new CommandHandler(this);
        functions = new Functions(this);
        events = new Events(this);
        musicutil = new MusicUtil(this);
        database = new Database(this);
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
            CommandHandler.reload();
        }
        if (all || mod === "functions") {
            delete require.cache[`${__dirname}/Functions.js`];
            Functions = require("./Functions");
            functions = new Functions(this);
        }
        if (all || mod === "events") {
            delete require.cache[`${__dirname}/Events.js`];
            Events = require("./Events");
            events = new Events(this);
        }
        if (all || mod === "music") {
            delete require.cache[`${__dirname}/MusicUtil.js`];
            MusicUtil = require("./MusicUtil");
            musicutil = new MusicUtil(this);
        }
    }

    get CommandHandler() {
        return CommandHandler;
    }

    get MusicUtil() {
        return musicutil;
    }

    get streams() {
        return MusicQueue;
    }

    get settings() {
        return database;
    }

    get bot() {
        return DiscordBot;
    }

    get config() {
        return Config;
    }

    get functions() {
        return functions;
    }

    get events() {
        return events;
    }
}

module.exports = Client;
