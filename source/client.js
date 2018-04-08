require("./utility/Extenders");

const { Client, Collection } = require("discord.js");

const config = require(`../config`);

const ProcessHandler = require("./handlers/Process");
const DatabaseHandler = require("./handlers/Database");
const TaskHandler = require("./handlers/Tasks");
const PermissionsHandler = require("./handlers/Permissions");
const AutoModerationHandler = require("./handlers/AutoModeration");
const ModerationLogHandler = require("./handlers/ModerationLog");
const MusicHandler = require("./handlers/Music");

const SettingStore = require("./stores/Settings");
const FunctionStore = require("./stores/Functions");
const CommandStore = require("./stores/Commands");
const EventStore = require("./stores/Events");

const MusicUtility = require("./utility/Music");

class TypicalBot extends Client {
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

        this.stores = {};
        this.stores.settings = new SettingStore(this);
        this.stores.functions = new FunctionStore(this);
        this.stores.commands = new CommandStore(this);
        this.stores.events = new EventStore(this);

        this.utility = {};
        this.utility.music = new MusicUtility(this);

        this.caches = {};
        this.caches.donors = new Collection();
        this.caches.bans = new Collection();
        this.caches.unbans = new Collection();
        this.caches.softbans = new Collection();
        this.caches.invites = new Collection();

        this.shards = {};

        this.login(this.config.token);
    }

    /*          this.client[store] access           */
    get settings() { return this.stores.settings; }
    get functions() { return this.stores.functions; }
    get commands() { return this.stores.commands; }
    get events() { return this.stores.events; }

    reload(arg) {

    }
}

new TypicalBot();