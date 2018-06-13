const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(oldMessage, message) {
        if (message.author.bot) return;
        if (message.channel.type !== "text") return;
        if (!message.guild.available) return;

        const settings = message.guild.settings = await message.guild.fetchSettings();

        const userPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author);
        if (userPermissions.level >= 2) return;
        if (settings.ignored.invites.includes(message.channel.id)) return;

        this.client.handlers.automoderation.invite(message).then(() => { return message.error(`An invite was detected in your message. Your message has been deleted.`); }).catch(console.error);
    }
}

module.exports = New;
