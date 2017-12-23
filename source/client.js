require("./utility/Extenders");

const { Client, Collection, Constants } = require("discord.js");

const build = process.env.CLIENT_BUILD;
const config = require(`../configs/${build}`);

let ProcessManager = require("./managers/Process");
let Database = require("./managers/Database");
let PermissionsManager = require("./managers/Permissions");
let ModlogsManager = require("./managers/ModerationLogs");
let AudioManager = require("./managers/Audio");

let SettingStore = require("./stores/Settings");
let FunctionStore = require("./stores/Functions");
let EventStore = require("./stores/Events");
let CommandStore = require("./stores/Commands");

let AutoModeration = require("./utility/AutoModeration");
let AudioUtility = require("./utility/Audio");

class TypicalBot extends Client {
    constructor() {
        super(config.clientOptions);

        Object.defineProperty(this, "build", { value: build });
        Object.defineProperty(this, "config", { value: config });

        this.shardID = Number(process.env.SHARD_ID);
        this.shardNumber = Number(process.env.SHARD_ID) + 1;
        this.shardCount = Number(process.env.SHARD_COUNT);

        this.processManager = new ProcessManager(this);
        this.database = new Database();
        this.permissions = new PermissionsManager(this);
        this.modlogsManager = new ModlogsManager(this);
        this.audioManager = new AudioManager(this);

        this.audioUtility = new AudioUtility(this);
        this.automod = new AutoModeration(this);

        this.settings = new SettingStore(this);
        this.functions = new FunctionStore(this);
        this.events = new EventStore(this);
        this.commands = new CommandStore(this);

        this.shardData = {};
        this.testerData = [];
        
        this.donors = new Collection();

        this.banCache = new Collection();
        this.unbanCache = new Collection();
        this.softbanCache = new Collection();

        this.login(config.token);
    }

    log(content, error = false) {
        error ?
            console.error(content) :
            console.log(content);
    }

    transmit(type, data = {}) {
        process.send({ type, data });
    }

    transmitStat(stat) {
        this.transmit("stats", { [stat]: this[stat].size });
    }

    transmitStats() {
        this.transmit("stats", {
            guilds: this.guilds.size,
            channels: this.channels.size,
            voiceConnections: this.voiceConnections.size,
            users: this.users.size
        });
    }

    reload(input) {
        const match = /(\w+)(?::(\w+))?/i.exec(input);
        if (!match && input !== "all") return;

        const mod = match ? match[1] : null;
        const all = input === "all";

        if (mod === "donors") {
            this.donors = new Collection();
            this.functions.fetchDonors();
        } else if (mod === "process") {
            delete require.cache[`${__dirname}/managers/Process.js`];
            ProcessManager = require("./managers/Process");
            this.processManager = new ProcessManager();
        } else if (mod === "database") {
            delete require.cache[`${__dirname}/managers/Database.js`];
            Database = require("./managers/Database");
            this.database = new Database();
        } else if (mod === "permissions") {
            delete require.cache[`${__dirname}/managers/Permissions.js`];
            PermissionsManager = require("./managers/Permissions");
            this.permissionsManager = new PermissionsManager(this);
        } else if (mod === "modlogs") {
            delete require.cache[`${__dirname}/managers/ModerationLogs.js`];
            ModlogsManager = require("./managers/ModerationLogs");
            this.modlogsManager = new ModlogsManager(this);
        } else if (mod === "audio") {
            delete require.cache[`${__dirname}/managers/Audio.js`];
            delete require.cache[`${__dirname}/Structures/Stream.js`];
            AudioManager = require("./managers/Audio");
            this.audioManager = new AudioManager(this);
        } else if (mod === "audioutility") {
            delete require.cache[`${__dirname}/utility/Audio.js`];
            AudioUtility = require("./utility/Audio");
            this.audioUtility = new AudioUtility(this);
        } else if (mod === "automod") {
            delete require.cache[`${__dirname}/utility/AudoModeration.js`];
            AutoModeration = require("./utility/AutoModeration");
            this.automod = new AutoModeration(this);
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
        } else if (mod === "commands") {
            const command = match[2];

            if (command) {
                this.commands.get(command).then(cmd => {
                    if (!cmd) return; this.commands.reload(cmd);
                });
            } else {
                delete require.cache[`${__dirname}/stores/Commands.js`];
                CommandStore = require("./stores/Commands");
                this.commands = new CommandStore(this);
            }
        }
    }
}

const client = new TypicalBot();

process
    .on("message", msg => client.processManager.message(msg))
    .on("uncaughtException", err => client.log(err.stack, true))
    .on("unhandledRejection", err => {
        if (!err) return;
        console.error(`Uncaught Promise Error:\n${err.stack || JSON.stringify(err)|| err}`);
    });
    