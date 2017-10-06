const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(message) {
        if (message.channel.type !== "text") return;

        const settings = await this.client.settingsManager.fetch(message.guild.id).catch(err => { return err; });

        if (!settings.logs.id || !settings.logs.delete) return;

        const channel = message.guild.channels.get(settings.logs.id);
        if (!channel) return;

        const user = message.author;

        if (settings.logs.delete === "--embed") return channel.buildEmbed()
            .setColor(0x3EA7ED)
            .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
            .setDescription(this.client.functions.lengthen.execute(-1, message.content, 100))
            .setFooter("Message Deleted")
            .setTimestamp()
            .send()
            .catch(() => console.log("Missing Permissions"));


        channel.send(
            settings.logs.delete === "--enabled" ?
                `**${user.username}#${user.discriminator}**'s message was deleted.` :
                this.client.functions.formatMessage.execute("logs-msgdel", message.guild, user, settings.logs.delete, { message, channel: message.channel })
        ).catch(() => console.log("Missing Permissions"));
    }
}

module.exports = New;
