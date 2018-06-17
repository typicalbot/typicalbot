const Event = require("../structures/Event");
const moment = require("moment");

class MessageBulkDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(messages) {
        const message = messages.first();

        if (message.channel.type !== "text") return;
        if (!message.guild.available) return;

        const settings = await this.client.settings.fetch(message.guild.id).catch(err => { return err; });

        if (!settings.logs.id || !settings.logs.delete) return;

        const logsChannel = message.guild.channels.get(settings.logs.id);
        if (!logsChannel) return;

        const channel = message.channel;

        const haste = await this.client.functions.hastebin(messages.map(m => `${moment(m.createdAt).format("dddd MMMM Do, YYYY, hh:mm A")} | ${m.author.tag} (${m.author.id}):\n${m.content}`).join("\n\n--  --  --  --  --\n\n"));

        if (settings.logs.delete === "--embed") return logsChannel.buildEmbed()
            .setColor(0x3EA7ED)
            .setDescription(`${messages.size} messages were purged: ${haste}`)
            .setFooter(`Messages Purged in #${channel.name} (${channel.id})`)
            .setTimestamp()
            .send()
            .catch(() => { return; });

        logsChannel.send(`${messages.size} messages were purged in ${channel.toString()} (${channel.id}): ${haste}`).catch(() => { return; });
    }
}

module.exports = MessageBulkDelete;
