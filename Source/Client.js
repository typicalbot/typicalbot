const ShardID = process.env.SHARD_ID;
const ShardCount = process.env.SHARD_COUNT;

let Config = require("./Config");

const Discord = require("discord.js");
const request = require("request");
const ytdl = require("ytdl-core");
const Webcord = require("Webcord");
const YouTubeAPI = require("simple-youtube-api");
const YouTube = new YouTubeAPI(Config.youtubekey);
const WebhookClient = new Webcord.WebhookClient();
const DiscordBot = new Discord.Client({"shardId": parseInt(ShardID), "shardCount": parseInt(ShardCount)});

let CommandHandler = require("./CommandHandler");
let Functions = require("./Functions"), functions;
let Events = require("./Events"), events;
let MusicUtil = require("./MusicUtil"), musicutil;
let Database = require("./Database"), database;

let AnnWebhook = WebhookClient.connect("233411483902410762", "-y8LT2tm-l9BubQW8HHeZMSlFYNZ49YdlqMHf1QD2_qFiW4NSFCshdqlzyInWor_Ftlm").then(webhook => AnnWebhook = webhook);

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
        if (mod === "all") {
            CommandHandler.reload();

            delete require.cache[`${__dirname}/Config.js`];
            Config = require("./Config");

            delete require.cache[`${__dirname}/Functions.js`];
            Functions = require("./Functions");
            functions = new Functions(this);

            delete require.cache[`${__dirname}/Events.js`];
            Events = require("./Events");
            events = new Events(this);

            delete require.cache[`${__dirname}/MusicUtil.js`];
            MusicUtil = require("./MusicUtil");
            musicutil = new MusicUtil(this);
        } else if (mod === "config") {
            delete require.cache[`${__dirname}/Config.json`];
            Config = require("./Config");
        } else if (mod === "commands") {
            CommandHandler.reload();
        } else if (mod === "Functions") {
            delete require.cache[`${__dirname}/Functions.js`];
            Functions = require("./Functions");
            functions = new Functions(this);
        } else if (mod === "events") {
            delete require.cache[`${__dirname}/Events.js`];
            Events = require("./Events");
            events = new Events(this);
        } else if (mod === "mutil") {
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

    get modules() {
        return {
            Discord: Discord,
            request: request,
            ytdl: ytdl,
            Webcord: Webcord,
            WebhookClient: WebhookClient,
            YouTubeAPI: YouTubeAPI,
            YouTube: YouTube
        };
    }

    get functions() {
        return functions;
    }

    get events() {
        return events;
    }

    get announcementWebhook() {
        return AnnWebhook;
    }
}

module.exports = Client;
