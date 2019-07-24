require("./utility/Extenders");

const { Client, Collection } = require("discord.js");

const config = require(`${process.cwd()}/config`);

const ProcessHandler = require("./handlers/Process");
const DatabaseHandler = require("./handlers/Database");
const TaskHandler = require("./handlers/Tasks");
const PermissionsHandler = require("./handlers/Permissions");
const AutoModerationHandler = require("./handlers/AutoModeration");
const ModerationLogHandler = require("./handlers/ModerationLog");
const MusicHandler = require("./handlers/Music");

//const TwitchWebhookHandler = require("./handlers/webhooks/Twitch");

const SettingHandler = require("./handlers/Settings");
const FunctionHandler = require("./handlers/Functions");
const CommandHandler = require("./handlers/Commands");
const EventHandler = require("./handlers/Events");

const MusicUtility = require("./utility/Music");

//const Raven = require("raven");
//Raven.config(config.raven).install();

class Shard extends Client {
    constructor() {
        super(config.clientOptions);

        Object.defineProperty(this, "config", { value: config });
        Object.defineProperty(this, "build", { value: config.build });

        this.shardID = Number(process.env.SHARD_ID);
        this.shardNumber = Number(process.env.SHARD_ID) + 1;
        this.shardCount = Number(process.env.SHARD_COUNT);

        this.handlers = {};
        this.handlers.process = new ProcessHandler(this);
        this.handlers.database = new DatabaseHandler(this);
        this.handlers.tasks = new TaskHandler(this);
        this.handlers.permissions = new PermissionsHandler(this);
        this.handlers.automoderation = new AutoModerationHandler(this);
        this.handlers.moderationLog = new ModerationLogHandler(this);
        this.handlers.music = new MusicHandler(this);
        
        //this.handlers.webhooks = {};
        //this.handlers.webhooks.twitch = new TwitchWebhookHandler(this);

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

    get usedRAM() {
        return Math.round(process.memoryUsage().heapUsed / 1048576);
    }

    get totalRAM() {
        return Math.round(process.memoryUsage().heapTotal / 1048576);
    }
}

new Shard();