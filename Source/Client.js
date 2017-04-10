const Discord = require("discord.js");
const Collection = Discord.Collection;

let ProcessManager = require("./Managers/Process");
let EventsManager = require("./Managers/Events");
let CommandsManager = require("./Managers/Commands");
let SettingsManager = require("./Managers/Settings");
let PermissionsManager = require("./Managers/Permissions");
let ModlogsManager = require("./Managers/ModerationLogs");

let Functions = require("./Utility/Functions");

const client = new class extends Discord.Client {
    constructor() {
        super({ messageCacheMaxSize: 150, disabledEvents: [ "CHANNEL_PINS_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "USER_NOTE_UPDATE", "TYPING_START", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE" ]});

        this.vr = process.env.CLIENT_VR;
        this.config = require(`../Configs/${this.vr}`);

        this.shardID = +process.env.SHARD_ID;
        this.shardNumber = +process.env.SHARD_ID + 1;
        this.shardCount = +process.env.SHARD_COUNT;

        this.processManager = new ProcessManager(this);
        this.eventsManager = new EventsManager(this);
        this.commandsManager = new CommandsManager(this);
        this.settingsManager = new SettingsManager(this);
        this.permissionsManager = new PermissionsManager(this);
        this.modlogsManager = new ModlogsManager(this);

        this.functions = new Functions(this);

        this.shardData = {};
        this.donorData = [];

        this.lastMessage = null;

        this.streams = new Collection();

        this.banCache = new Collection();
        this.unbanCache = new Collection();
        this.softbanCache = new Collection();

        this.once("ready", () => this.eventsManager.onceReady())
        .on("ready", () => this.eventsManager.ready())
        .on("warn", err => this.log(err, true))
        .on("error", err => this.log(err, true))
        .on("message", message => this.eventsManager.message(message))
        .on("messageDelete", message => this.eventsManager.messageDelete(message))
        .on("guildMemberAdd", member => this.eventsManager.guildMemberAdd(member));

        if (this.vr === "stable") setInterval(() => this.functions.sendStats("c"), 1200000);

        setInterval(() => {
            if (this.settingsManager.connection.state === "disconnected") this.settingsManager.connection.connect();
            if (this.lastMessage && Date.now() - this.lastMessage > 120000) { this.destroy(); return this.login(process.env.CLIENT_TOKEN); }
        }, 60000);

        this.login();
    }

    log(content, error = false) {
        error ?
            console.error(`SHARD ${this.shardID} | ${content}`) :
            console.log(`SHARD ${this.shardID} | ${content}`);
    }

    transmit(type, data) {
        process.send({ type, data });
    }

    transmitStat(stat) {
        this.transmit("stat", { [stat]: this[stat].size });
    }
};

process.on("message", msg => client.processManager.message(msg))
.on("uncaughtException", err => client.log(err.stack, true))
.on("unhandledRejection", err => client.log(err.stack, true));
