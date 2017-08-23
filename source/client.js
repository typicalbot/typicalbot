require("./utility/Extenders");

const { Client, Collection, Constants } = require("discord.js");

const ProcessManager = require("./managers/Process");

let Database = require("./managers/Database");

let EventsManager = require("./managers/Events");
let CommandsManager = require("./managers/Commands");
let SettingsManager = require("./managers/Settings");
let PermissionsManager = require("./managers/Permissions");
let ModlogsManager = require("./managers/ModerationLogs");
let AudioManager = require("./managers/Audio");

let Functions = require("./utility/Functions");
let AutoModeration = require("./utility/AutoModeration");
let AudioUtility = require("./utility/Audio");

const client = new class extends Client {
    constructor() {
        super({ messageCacheMaxSize: 150 });

        this.build = process.env.CLIENT_BUILD;
        this.config = require(`../configs/${this.build}`);

        this.shardID = +process.env.SHARD_ID;
        this.shardNumber = +process.env.SHARD_ID + 1;
        this.shardCount = +process.env.SHARD_COUNT;

        this.database = new Database();

        this.processManager = new ProcessManager(this);
        this.eventsManager = new EventsManager(this);
        this.commandsManager = new CommandsManager(this);
        this.settingsManager = new SettingsManager(this);
        this.permissionsManager = new PermissionsManager(this);
        this.modlogsManager = new ModlogsManager(this);
        this.audioManager = new AudioManager(this);

        this.functions = new Functions(this);
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

        this.once("ready", () => this.eventsManager.ready())
        //.on("debug", debug => console.log(debug.replace(this.token, "REDACTED")))
        .on("warn", err => this.log(err, true))
        .on("error", err => this.log(err, true))
        .on("message", message => this.eventsManager.message(message))
        .on("messageUpdate", (oldMessage, message) => this.eventsManager.messageUpdate(oldMessage, message))
        .on("messageDelete", message => this.eventsManager.messageDelete(message))
        .on("guildMemberAdd", member => this.eventsManager.guildMemberAdd(member))
        .on("guildMemberRemove", member => this.eventsManager.guildMemberRemove(member))
        .on("guildMemberUpdate", (oldMember, member) => this.eventsManager.guildMemberUpdate(oldMember, member))
        .on("guildBanAdd", (guild, user) => this.eventsManager.guildBanAdd(guild, user))
        .on("guildBanRemove", (guild, user) => this.eventsManager.guildBanRemove(guild, user))
        .on("guildCreate", (guild) => this.eventsManager.guildCreate(guild))
        .on("guildDelete", (guild) => this.eventsManager.guildDelete(guild));

        if (this.build === "stable") setInterval(() => this.functions.sendStats("c"), 1200000);

        this.setInterval(() => { this.commandsStats.shift(); this.commandsStats.push(0); }, 60000);

/*
        setInterval(() => {
            if (this.settingsManager.connection.state === "disconnected") this.settingsManager.connection.connect();
            if (this.lastMessage && Date.now() - this.lastMessage > 120000) { this.destroy(); return this.login(process.env.CLIENT_TOKEN); }
        }, 60000);
*/

        this.login(process.env.CLIENT_TOKEN);
    }

    log(content, error = false) {
        error ?
            console.error(`SHARD ${this.shardID} | ${content}`) :
            console.log(`SHARD ${this.shardID} | ${content}`);
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
            "commands": this.commands
        });
    }

    reload(input) {
        const match = /(\w+)(?::(\w+))?/i.exec(input);
        if (!match && input !== "all") return;

        const mod = match ? match[1] : null;
        const all = input === "all";

        if (mod === "database") {
            delete require.cache[`${__dirname}/managers/Database.js`];
            Database = require("./managers/Database");
            this.database = new Database();
        } else if (all || mod === "events") {
            delete require.cache[`${__dirname}/managers/Events.js`];
            EventsManager = require("./managers/Events");
            this.eventsManager = new EventsManager(this);
        } else if (mod === "commands") {
            const command = match[2];

            if (command) {
                this.commandsManager.get(command).then(cmd => {
                    if (!cmd) return; this.commandsManager.reload(cmd.path);
                });
            } else {
                delete require.cache[`${__dirname}/managers/Commands.js`];
                CommandsManager = require("./managers/Commands");
                this.commandsManager = new CommandsManager(this);
            }
        } else if (mod === "settings") {
            delete require.cache[`${__dirname}/managers/Settings.js`];
            SettingsManager = require("./managers/Settings");
            this.settingsManager = new SettingsManager(this);
        } else if (all || mod === "permissions") {
            delete require.cache[`${__dirname}/managers/Permissions.js`];
            PermissionsManager = require("./managers/Permissions");
            this.permissionsManager = new PermissionsManager(this);
        } else if (all || mod === "modlogs") {
            delete require.cache[`${__dirname}/managers/ModerationLogs.js`];
            ModlogsManager = require("./managers/ModerationLogs");
            this.modlogsManager = new ModlogsManager(this);
        } else if (all || mod === "audio") {
            delete require.cache[`${__dirname}/managers/Audio.js`];
            delete require.cache[`${__dirname}/Structures/Stream.js`];
            AudioManager = require("./managers/Audio");
            this.audioManager = new AudioManager(this);
        } else if (all || mod === "functions") {
            delete require.cache[`${__dirname}/utility/Functions.js`];
            Functions = require("./utility/Functions");
            this.functions = new Functions(this);
        } else if (all || mod === "automod") {
            delete require.cache[`${__dirname}/utility/AudoModeration.js`];
            AutoModeration = require("./utility/AutoModeration");
            this.automod = new AutoModeration(this);
        } else if (all || mod === "audioutility") {
            delete require.cache[`${__dirname}/utility/Audio.js`];
            AudioUtility = require("./utility/Audio");
            this.audioUtility = new AudioUtility(this);
        }
    }
};

process.on("message", msg => client.processManager.message(msg))
.on("uncaughtException", err => client.log(err.stack, true))
.on("unhandledRejection", err => client.log(err.stack, true));
