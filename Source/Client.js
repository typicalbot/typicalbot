const ShardID = process.env.SHARD_ID;
const ShardCount = process.env.SHARD_COUNT;

const Discord = require("discord.js");

let cmdh = require("./CommandHandler");
let fn = require("./Functions");
let ev = require("./Events");

const client = new class Client {
    constructor() {
        this.ShardID = ShardID;
        this.ShardCount = ShardCount;
        this.data = {};

        this.config = require("./Config");
        this.commands = new cmdh();
        this.functions = new fn(this);
        this.events = new ev(this);
        this.settings = require("./Database");
        this.modlog = require("./Extras/LogUtil");
        this.modlog.setup(this);

        this.streams = new Map();

        let bot = this.bot = new Discord.Client();
        bot.login(this.config.token).catch(err => this.events.error(err));

        bot
            .once("ready", () => {
                this.events.ready();
                setInterval(() => this.events.intervalStatus(), 300000);
                setInterval(() => this.events.intervalPost(), 1200000);
                setInterval(() => process.send({"type": "stat", "data": {"heap": process.memoryUsage().heapUsed/1024/1024}}), 60000);
            })
            .on("warn", console.error)
            .on("error", console.error)
            .on("reconnecting", () => console.error("Reconnecting"))
            .on("disconnect", () => console.error("Disconnected"))
            .on("message", message => this.events.message(message))
            .on("guildMemberAdd", (member) => this.events.guildMemberAdd(member))
            .on("guildMemberRemove", (member) => this.events.guildMemberRemove(member))
            .on("guildBanAdd", (guild, user) => this.events.guildBanAdd(guild, user))
            .on("guildBanRemove", (guild, user) => this.events.guildBanRemove(guild, user))
            .on("guildMemberUpdate", (oldMember, newMember) => this.events.guildMemberUpdate(oldMember, newMember))
            .on("guildCreate", guild => this.events.guild(guild))
            .on("guildDelete", guild => this.events.guild(guild));
    }

    log(data) {
        console.log(`SHARD ${ShardID} | ${data}`);
    }

    send(type, key, data) {
        process.send({"type": type, [key]: data});
    }

    sendStat(stat) {
        let value = this.bot[stat].size;
        process.send({"type": "stat", "data": {[stat]: value}});
    }

    reload(mod) {
        let all = mod === "all";
        if (all || mod === "commands") {
            this.commands.reload();
        }
        if (all || mod === "functions") {
            delete require.cache[`${__dirname}/Functions.js`];
            fn = require("./Functions");
            this.functions = new fn(this);
        }
        if (all || mod === "events") {
            delete require.cache[`${__dirname}/Events.js`];
            ev = require("./Events");
            this.events = new ev(this);
        }
        if (all || mod === "modlog") {
            delete require.cache[`${__dirname}/Extras/LogUtil.js`];
            this.modlog = require("./Extras/LogUtil");
            this.modlog.setup(this);
        }
        if (mod === "database") {
            delete require.cache[`${__dirname}/Database.js`];
            this.settings = require("./Database");
        }
    }
};

process
    .on("message", message => client.events.processMessage(message))
    .on("unhandledRejection", (reason, p) => console.error('Unhandled Rejection at: Promise', p, 'reason:', reason));
