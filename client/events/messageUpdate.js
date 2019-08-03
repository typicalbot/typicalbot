const Constants = require("../utility/Constants");
const Event = require("../structures/Event");

class MessageUpdate extends Event {
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

        if (userPermissions.level < Constants.Permissions.Levels.SERVER_MODERATOR && !settings.ignored.invites.includes(message.channel.id))
            this.client.handlers.automoderation.invite(message);
    }
}

module.exports = MessageUpdate;
