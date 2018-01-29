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

        const channel = messages.first().guild.channels.get(settings.logs.id);
        if (!channel) return;

        if (settings.logs.delete === "--embed") return channel.buildEmbed()
            .setColor(0x3EA7ED)
            .setDescription(await this.client.functions.hastebin())
            .setFooter(`Messages Deleted in #${channel.name} (${channel.id})`)
            .setTimestamp()
            .send()
            .catch(() => { return; });


        channel.send(`${messages.size} messages were purged in ${channel.toString()} (${channel.id})`).catch(() => { return; });
    }
}

module.exports = New;
