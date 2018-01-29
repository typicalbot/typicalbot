const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(messages) {        
        if (messages.first().channel.type !== "text") return;
        if (!messages.first().guild.available) return;

        const settings = await this.client.settings.fetch(messages.first().guild.id).catch(err => { return err; });

        if (!settings.logs.id || !settings.logs.delete) return;

        const logsChannel = messages.first().guild.channels.get(settings.logs.id);
        if (!logsChannel) return;

        const channel = messages.first().channel;

        const haste = await this.client.functions.hastebin(messages.map(m => `${m.author.tag} (${m.author.id}):\n${m.content}`).join("\n"));

        if (settings.logs.delete === "--embed") return channel.buildEmbed()
            .setColor(0x3EA7ED)
            .setDescription(haste)
            .setFooter(`Messages Deleted in #${channel.name} (${channel.id})`)
            .setTimestamp()
            .send()
            .catch(() => { return; });


        logsChannel.send(`${messages.size} messages were purged in ${channel.toString()} (${channel.id}): ${haste}`).catch(() => { return; });
    }
}

module.exports = New;
