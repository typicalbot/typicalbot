require("../utility/Extenders");

const { Client, Collection }    = require("discord.js");

const build                     = process.env.CLIENT_BUILD;
const config                    = require(`../configs/${build}`);

/*          Handlers            */
let ProcessHandler              = require("./handlers/Process");
let DatabaseHandler             = require("./handlers/Database");
let TaskHandler                 = require("./handlers/Tasks");
let PermissionsHandler          = require("./handlers/Permissions");
let AutoModerationHandler       = require("./handlers/AutoModeration");
let ModerationLogHandler        = require("./handlers/ModerationLog");
let MusicHandler                = require("./handlers/Music");

/*          Stores              */
let SettingStore                = require("./stores/Settings");
let FunctionStore               = require("./stores/Functions");
let CommandStore                = require("./stores/Commands");
let EventStore                  = require("./stores/Events");

/*          Utility             */
let MusicUtility                = require("./utility/Music");

class TypicalBot extends Client {
    constructor() {
        super(config.clientOptions);

        Object.defineProperty(this, "build", { value: build });
        Object.defineProperty(this, "config", { value: config });

        this.shardID                    = Number(process.env.SHARD_ID);
        this.shardNumber                = Number(process.env.SHARD_ID) + 1;
        this.shardCount                 = Number(process.env.SHARD_COUNT);

        this.handlers                   = {};
        this.handlers.process           = new ProcessHandler(this);
        this.handlers.database          = new DatabaseHandler(this);
        this.handlers.tasks             = new TaskHandler(this);
        this.handlers.permissions       = new PermissionsHandler(this);
        this.handlers.automoderation    = new AutoModerationHandler(this);
        this.handlers.moderationLog     = new ModerationLogHandler(this);
        this.handlers.music             = new MusicHandler(this);

        this.stores                     = {};
        this.stores.settings            = new SettingStore(this);
        this.stores.functions           = new FunctionStore(this);
        this.stores.commands            = new CommandStore(this);
        this.stores.events              = new EventStore(this);

        this.shards = {};

        this.caches                     = {};
        this.caches.donors              = new Collection();
        this.caches.bans                = new Collection();
        this.caches.unbans              = new Collection();
        this.caches.softbans            = new Collection();

        this.utility                    = {};
        this.utility.MusicHandler       = new MusicUtility(this);

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