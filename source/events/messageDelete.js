const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(message) {
        if (message.channel.type !== "text") return;

        const settings = await this.client.settings.fetch(message.guild.id).catch(err => { return err; });

        if (!settings.logs.id || !settings.logs.delete) return;

        const channel = message.guild.channels.get(settings.logs.id);
        if (!channel) return;

        const user = message.author;

        if (settings.logs.delete === "--embed") return channel.buildEmbed()
            .setColor(0x3EA7ED)
            .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
            .setDescription(this.client.functions.lengthen(-1, message.content, 100))
            .setFooter(`Message Deleted in #${message.channel.name} (${message.channel.id})`)
            .setTimestamp()
            .send()
            .catch(() => { return; });


        channel.send(
            settings.logs.delete === "--enabled" ?
                `**${user.username}#${user.discriminator}**'s message was deleted.` :
                this.client.functions.formatMessage("logs-msgdel", message.guild, user, settings.logs.delete, { message, channel: message.channel })
        ).catch(() => { return; });
    }
}

module.exports = New;
