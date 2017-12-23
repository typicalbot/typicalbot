const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, message, user) {
        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || !settings.logs.invite) return;

        const channel = guild.channels.get(settings.logs.id);
        if (!channel) return;

        channel.send(
            settings.logs.invite === "--enabled" ?
                `**${user.username}#${user.discriminator}** posted an invite in <#${message.channel.id}>.` :
                this.client.functions.formatMessage("logs-invite", guild, user, settings.logs.invite, { channel: message.channel })
        );
    }
}

module.exports = New;
