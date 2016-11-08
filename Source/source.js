//if (process.env.SHARD_ID < 7) require('@risingstack/trace');

const Client = require("./Client");
const client = new Client();
client.bot
    .on("ready", () => {
        client.events.ready();
        setInterval(() => client.events.intervalStatus(), 60000);
        setInterval(() => client.events.intervalPost(), 1200000);
        setInterval(() => client.sendStat("voiceConnections"), 10000);
    })
    .on("warn", warning => client.events.warn(warning))
    .on("error", error => client.events.error(error))
    .on("reconnecting", () => client.events.reconnecting())
    .on("disconnect", () => client.events.disconnect())
    .on("message", message => client.events.message(message))
    .on("guildMemberAdd", (member) => client.events.guildMemberAdd(member))
    .on("guildMemberRemove", (member) => client.events.guildMemberRemove(member))
    .on("guildBanAdd", (guild, user) => client.events.guildBanAdd(guild, user))
    .on("guildBanRemove", (guild, user) => client.events.guildBanRemove(guild, user))
    .on("guildMemberUpdate", (oldMember, newMember) => client.events.guildMemberUpdate(oldMember, newMember))
    .on("guildCreate", guild => client.events.guildCreate(guild))
    .on("guildDelete", guild => client.events.guildDelete(guild));

process
    .on("message", message => client.events.processMessage(message))
//    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", (reason, p) => console.error('Unhandled Rejection at: Promise', p, 'reason:', reason));
