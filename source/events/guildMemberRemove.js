const Event = require("../structures/Event");
const { Collection } = require("discord.js");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(member) {
        const guild = member.guild;

        const bans = await guild.fetchBans().catch(() => console.log("Missing Permissions"));
        if (bans instanceof Collection && bans.has(member.id)) return;

        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || settings.logs.leave === "--disabled") return;

        const user = member.user;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.leave === "--embed") {
            channel.buildEmbed()
                .setColor(0xFF6600)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Left")
                .setTimestamp()
                .send()
                .catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.logs.leave ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.leave) :
                    `**${user.tag}** has left the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }
}

module.exports = New;
