const Discord = require("discord.js");

let CommandsManager = require("./Managers/Commands");
let SettingsManager = require("./Managers/Settings");

let Functions = require("./Util/Functions");
let Events = require("./Util/Events");

const client = new class extends Discord.Client {
    constructor() {
        super({
            messageCacheMaxSize: 150,
            disabledEvents: [ "CHANNEL_PINS_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "USER_NOTE_UPDATE", "TYPING_START", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE" ]
        });

        this.commands = new CommandsManager(this);
        this.functions = new Functions(this);
        this.events = new Events(this);
        this.settings = new SettingsManager();
        this.modlog = require("./Managers/ModerationLog").setup(this);

        this.config = require("../config");

        this.shardID = process.env.SHARD_ID;
        this.shardCount = process.env.SHARD_COUNT;

        this.data = {};

        this.donors = [];

        this.once("ready", () => {
            this.log(`Client Connected | Shard ${+this.shardID + 1} / ${this.shardCount}`);
            this.transmitStat("guilds");
            this.user.setGame(`Client Starting`);

            this.ws.ws.on("close", ev => this.log(`Websocket Closed: ${ev}`, true));

            setInterval(() => this.user.setGame(`${this.config.prefix}help | ${this.data.guilds} Servers`), 300000);
            if (this.config.bot === "main") { this.events.statsPost(); setInterval(() => this.events.statsPost(), 1200000); }
        })
        .on("warn", err => this.log(err, true))
        .on("error", err => this.log(err, true))
        .on("reconnecting", () => this.log("Reconnecting", true))
        .on("disconnect", () => this.log("Disconnected", true))
        .on("message", message => this.events.message(message))
        .on("guildMemberAdd", (member) => this.events.guildMemberAdd(member))
        .on("guildMemberRemove", (member) => this.events.guildMemberRemove(member))
        .on("guildBanAdd", (guild, user) => this.events.guildBanAdd(guild, user))
        .on("guildBanRemove", (guild, user) => this.events.guildBanRemove(guild, user))
        .on("guildMemberUpdate", (oldMember, newMember) => this.events.guildMemberUpdate(oldMember, newMember))
        .on("guildCreate", guild => this.events.guildCreate(guild))
        .on("guildDelete", guild => this.events.guildDelete(guild));

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
            this.commands.reload();
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
            this.modlog = require("./Managers/ModerationLog").setup(this);
        }
        if (mod === "database") {
            delete require.cache[`${__dirname}/Managers/Settings.js`];
            SettingsManager = require("./Managers/Settings");
            this.settings.connection.end();
            this.settings = new SettingsManager();
        }
    }
};

process.on("message", message => client.events.processMessage(message))
.on("uncaughtException", err => {
    client.log(err.stack, true);
})
.on("unhandledRejection", (reason, p) => console.error('Unhandled Rejection at: Promise', p, 'reason:', reason));
