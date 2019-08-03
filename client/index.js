require("./utility/Extenders");

const { Client, Collection } = require("discord.js");

const config = require("../../config.json");

const DatabaseHandler = require("./handlers/Database");
const TaskHandler = require("./handlers/Tasks");
const PermissionsHandler = require("./handlers/Permissions");
const AutoModerationHandler = require("./handlers/AutoModeration");
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
        this.shardCount = config.shardCount;

        this.handlers = {};
        this.handlers.database = new DatabaseHandler(this);
        this.handlers.tasks = new TaskHandler(this);
        this.handlers.permissions = new PermissionsHandler(this);
        this.handlers.automoderation = new AutoModerationHandler(this);
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

        this.login(this.config.token);
    }

    fetchData(property) {
        return this.node.sendTo("manager", {
            event: "collectData",
            data: property
        }, { receptive: true });
    }

    get usedRAM() {
        return Math.round(process.memoryUsage().heapUsed / 1048576);
    }

    get totalRAM() {
        return Math.round(process.memoryUsage().heapTotal / 1048576);
    }
};