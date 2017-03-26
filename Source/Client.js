const Discord = require("discord.js");

let CommandsManager = require("./Managers/Commands");
let SettingsManager = require("./Managers/Settings");
let ModerationLogManager = require("./Managers/ModerationLog");
let AudioManager = require("./Managers/Audio");
let ProcessManager = require("./Managers/Process");

let Functions = require("./Util/Functions");
let Events = require("./Util/Events");

const client = new class extends Discord.Client {
    constructor() {
        super({
            messageCacheMaxSize: 150,
            disabledEvents: [ "CHANNEL_PINS_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "USER_NOTE_UPDATE", "TYPING_START", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE" ]
        });

        this.commandsManager = new CommandsManager(this);
        this.functions = new Functions(this);
        this.events = new Events(this);
        this.settingsManager = new SettingsManager();
        this.modlogManager = new ModerationLogManager(this);
        this.audioManager = new AudioManager(this);
        this.processManager = new ProcessManager(this);

        this.vr = process.env.CLIENT_VR;
        this.config = require(`../configs/${this.vr}`);

        this.shardID = process.env.SHARD_ID;
        this.shardNumber = +process.env.SHARD_ID + 1;
        this.shardCount = process.env.SHARD_COUNT;

        this.data = {};
        this.donors = [];

        this.lastMessage = null;
        this.streams = new Map();
        this.banLogs = new Map();
        this.unbanLogs = new Map();
        this.softbans = new Map();

        this.once("ready", () => {
            this.transmitStat("guilds");
            this.user.setGame(`Client Starting`);
            if (this.vr === "alpha" && this.guilds.has("163038706117115906")) this.functions.sendDonors();

            if (this.vr === "alpha") setTimeout(() => this.guilds.forEach(g => {
                if (!this.functions.alphaCheck(g)) g.leave();
            }), 5000);

            setInterval(() => {
                this.user.setGame(`${this.config.prefix}help | ${this.data.guilds} Servers`);

                if (this.vr === "alpha" && this.guilds.has("163038706117115906")) this.functions.sendDonors();
            }, 300000);
        })
        .on("ready", () => this.log(`Client Connected | Shard ${this.shardNumber} / ${this.shardCount}`))
        .on("warn", err => this.log(err, true))
        .on("error", err => this.log(err, true))
        .on("reconnecting", () => this.log("Reconnecting", true))
        .on("disconnect", () => this.log("Disconnected", true))
        .on("message", message => this.events.message(message))
        .on("messageUpdate", (oldMessage, message) => this.events.messageUpdate(oldMessage, message))
        .on("guildMemberAdd", (member) => this.events.guildMemberAdd(member))
        .on("guildMemberRemove", (member) => this.events.guildMemberRemove(member))
        .on("guildBanAdd", (guild, user) => this.events.guildBanAdd(guild, user))
        .on("guildBanRemove", (guild, user) => this.events.guildBanRemove(guild, user))
        .on("guildMemberUpdate", (oldMember, newMember) => this.events.guildMemberUpdate(oldMember, newMember))
        .on("guildCreate", guild => this.events.guildCreate(guild))
        .on("guildDelete", guild => this.events.guildDelete(guild));

        if (this.vr === "stable") setInterval(() => this.functions.sendStats("c"), 1200000);

        setInterval(() => {
            if (!this.lastMessage && this.settingsManager.connection.state !== "disconnected") return;
            if (this.settingsManager.connection.state === "disconnected") this.settingsManager.connection.connect();
            if (Date.now() - this.lastMessage > 120000) {
                this.destroy();
                return this.login(process.env.CLIENT_TOKEN);
            }
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

    reload(mod) {
        let all = mod === "all";
        if (all || mod === "commands") {
            this.commandsManager.reload();
        }
        if (all || mod === "functions") {
            delete require.cache[`${__dirname}/Util/Functions.js`];
            Functions = require("./Util/Functions");
            this.functions = new Functions(this);
        }
        if (all || mod === "events") {
            delete require.cache[`${__dirname}/Util/Events.js`];
            Events = require("./Util/Events");
            this.events = new Events(this);
        }
        if (all || mod === "modlog") {
            delete require.cache[`${__dirname}/Managers/ModerationLog.js`];
            ModerationLogManager = require("./Managers/ModerationLog");
            this.modlogManager = new ModerationLogManager(this);
        }
        if (mod === "database") {
            delete require.cache[`${__dirname}/Managers/Settings.js`];
            SettingsManager = require("./Managers/Settings");
            this.settingsManager.connection.end();
            this.settingsManager = new SettingsManager();
        }
    }
};

process.on("message", msg => client.processManager.register(msg))
.on("uncaughtException", err => client.log(err.stack, true))
.on("unhandledRejection", err => client.log(err.stack, true));
