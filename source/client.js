require("./utility/Extenders");

const { Client, Collection, Constants } = require("discord.js");

const build = process.env.CLIENT_BUILD;
const config = require(`../configs/${build}`);

const Database = require("./managers/Database");
const ProcessManager = require("./managers/Process");
//const SettingsManager = require("./managers/Settings");

const PermissionsManager = require("./managers/Permissions");
const ModlogsManager = require("./managers/ModerationLogs");
const AudioManager = require("./managers/Audio");

const SettingsStore = require("./stores/Settings");
const EventStore = require("./stores/Events");
const FunctionStore = require("./stores/Functions");
const CommandStore = require("./stores/Commands");

const AutoModeration = require("./utility/AutoModeration");
const AudioUtility = require("./utility/Audio");

const client = new class TypicalBot extends Client {
    constructor() {
        super(config.clientOptions);

        this.build = build;
        this.config = config;

        this.shardID = Number(process.env.SHARD_ID);
        this.shardNumber = Number(process.env.SHARD_ID) + 1;
        this.shardCount = Number(process.env.SHARD_COUNT);

        this.database = new Database();
        this.processManager = new ProcessManager(this);

        this.settings = new SettingsStore(this);
        this.functions = new FunctionStore(this);
        this.events = new EventStore(this);
        this.commands = new CommandStore(this);

        //this.settingsManager = new SettingsManager(this);
        this.permissionsManager = new PermissionsManager(this);
        this.modlogsManager = new ModlogsManager(this);
        this.audioManager = new AudioManager(this);
        this.automod = new AutoModeration(this);
        this.audioUtility = new AudioUtility(this);

        this.shardData = {};
        this.testerData = [];
        this.donorData = [];

        this.lastMessage = null;

        this.commandsStats = Array(60).fill(0);

        this.streams = new Collection();

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
        this.transmit("stat", { [stat]: this[stat].size });
    }

    transmitStats() {
        this.transmit("stats", {
            guilds: this.guilds.size,
            channels: this.channels.size,
            voiceConnections: this.voiceConnections.size,
            users: this.users.size
        });
        this.transmit("status", {
            "status": this.status === Constants.Status.READY ? 0 : 1,
            "uptime": this.uptime
        });
        this.transmit("commands", {
            "commands": this.commandsStats
        });
    }
};

process
    .on("message", msg => client.processManager.message(msg))
    .on("uncaughtException", err => client.log(err.stack, true))
    .on("unhandledRejection", err => {
        if (!err) return;
        console.error(`Uncaught Promise Error: \n${err.stack || err}`);
    });
