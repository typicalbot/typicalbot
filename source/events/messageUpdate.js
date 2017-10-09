const Event = require("../structures/Event");
const Response = require("../structures/Response");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(oldMessage, message) {
        if (message.author.bot) return;
        if (message.channel.type !== "text") return;

        message.guild.settings = await this.client.settingsManager.fetch(message.guild.id);

        const userPermissions = this.client.permissionsManager.get(message.guild, message.author);
        if (userPermissions.level >= 2) return;

        const response = new Response(this.client, message);

        this.client.automod.inviteCheck(response).then(() => { return response.error(`An invite was detected in your message. Your message has been deleted.`); }).catch(console.error);
    }
}

module.exports = New;
