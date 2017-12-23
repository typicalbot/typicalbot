const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(oldMessage, message) {
        if (message.author.bot) return;
        if (message.channel.type !== "text") return;

        message.guildSettings = await this.client.settings.fetch(message.guild.id);

        const userPermissions = this.client.permissions.fetch(message.guild, message.author);
        if (userPermissions.level >= 2) return;

        this.client.automod.inviteCheck(message).then(() => { return message.error(`An invite was detected in your message. Your message has been deleted.`); }).catch(console.error);
    }
}

module.exports = New;
