const Event = require("../structures/Event");
const { Collection } = require("discord.js");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(member) {
        const guild = member.guild;

        const bans = await guild.fetchBans().catch(() => { return; });
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
                .catch(() => { return; });
        } else {
            channel.send(
                settings.logs.leave ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.leave) :
                    `**${user.tag}** has left the server.`
            ).catch(() => { return; });
        }
    }
}

module.exports = New;
