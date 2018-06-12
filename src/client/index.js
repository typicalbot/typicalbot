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

const SettingHandler = require("./handlers/Settings");
const FunctionHandler = require("./handlers/Functions");
const CommandHandler = require("./handlers/Commands");
const EventHandler = require("./handlers/Events");

const MusicUtility = require("./utility/Music");

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

        this.shards = {};

        console.log("Logging In");
        this.login(this.config.token)
            .then(() => console.log("Logging In"))
            .catch(console.error);
    }

    reload(arg) {
        const args = /(\w+)(?::(\w+))?/i.exec(arg);
        if (!args && arg !== "all") return;

        const mod = args ? args[1] : null;
        const all = arg === "all";

        /*if (mod === "donors") {
            this.donors = new Collection();
            this.functions.fetchDonors();
        } else if (mod === "process") {
            delete require.cache[`${__dirname}/managers/Process.js`];
            ProcessHandler = require("./managers/Process");
            this.processHandler = new ProcessHandler();
        } else if (mod === "database") {
            delete require.cache[`${__dirname}/managers/Database.js`];
            DatabaseHandler = require("./managers/Database");
            this.database = new DatabaseHandler();
        } else if (mod === "permissions") {
            delete require.cache[`${__dirname}/managers/Permissions.js`];
            PermissionsHandler = require("./managers/Permissions");
            this.permissionsHandler = new PermissionsHandler(this);
        } else if (mod === "modlogs") {
            delete require.cache[`${__dirname}/managers/ModerationLogs.js`];
            ModerationLogHandler = require("./managers/ModerationLogs");
            this.modlogsHandler = new ModerationLogHandler(this);
        } else if (mod === "audio") {
            delete require.cache[`${__dirname}/managers/Audio.js`];
            delete require.cache[`${__dirname}/Structures/Stream.js`];
            MusicHandler = require("./managers/Audio");
            this.audioHandler = new MusicHandler(this);
        } else if (mod === "audioutility") {
            delete require.cache[`${__dirname}/utility/Audio.js`];
            MusicUtility = require("./utility/Audio");
            this.audioUtility = new MusicUtility(this);
        } else if (mod === "automod") {
            delete require.cache[`${__dirname}/utility/AudoModeration.js`];
            AutoModerationHandler = require("./utility/AutoModeration");
            this.automod = new AutoModerationHandler(this);
        } else if (mod === "settings") {
            delete require.cache[`${__dirname}/stores/Settings.js`];
            SettingStore = require("./stores/Settings");
            this.settings = new SettingStore(this);
        } else if (mod === "functions") {
            delete require.cache[`${__dirname}/stores/Functions.js`];
            FunctionStore = require("./stores/Functions");
            this.functions = new FunctionStore(this);
        } else if (mod === "events") {
            this.events.forEach(e => this.removeAllListeners(e.name));
            this.events.reload();

            delete require.cache[`${__dirname}/stores/Events.js`];
            EventStore = require("./stores/Events");
            this.events = new EventStore(this);
        } else if (mod === "tasks") {
            delete require.cache[`${__dirname}/utility/AudoModeration.js`];
            AutoModerationHandler = require("./utility/AutoModeration");
            this.automod = new AutoModerationHandler(this);
        } else if (mod === "commands") {
            const command = args[2];

            if (command) {
                this.commands.get(command).then(cmd => {
                    if (!cmd) return; this.commands.reload(cmd);
                });
            } else {
                delete require.cache[`${__dirname}/stores/Commands.js`];
                CommandStore = require("./stores/Commands");
                this.commands = new CommandStore(this);
            }
        }*/
    }
}

new Shard();