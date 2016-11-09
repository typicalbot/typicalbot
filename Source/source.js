const Client = require("./Client");
const client = new Client();
client.bot
    .on("ready", () => {
        client.events.ready();
        setInterval(() => client.events.intervalStatus(), 60000);
        setInterval(() => client.events.intervalPost(), 1200000);
        setInterval(() => client.sendStat("voiceConnections"), 10000);
        setInterval(() => {
            process.send({"type": "stat", "data": {"heap": process.memoryUsage().heapUsed/1024/1024}});
        }, 5000);
    })
    .on("warn", console.error)
    .on("error", console.error)
    .on("reconnecting", () => console.error("Reconnecting"))
    .on("disconnect", () => console.error("Disconnected"))
    .on("message", client.events.message)
    .on("guildMemberAdd", client.events.guildMemberAdd)
    .on("guildMemberRemove", client.events.guildMemberRemove)
    .on("guildBanAdd", client.events.guildBanAdd)
    .on("guildBanRemove", client.events.guildBanRemove)
    .on("guildMemberUpdate", client.events.guildMemberUpdate)
    .on("guildCreate", client.events.guild)
    .on("guildDelete", client.events.guild);

process
    .on("message", message => client.events.processMessage(message))
    .on("unhandledRejection", (reason, p) => console.error('Unhandled Rejection at: Promise', p, 'reason:', reason));
