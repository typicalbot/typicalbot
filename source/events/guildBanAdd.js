const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, user) {
        if (!guild.available) return;
        
        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.moderation && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.banCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "ban", user }, cachedLog));
            this.client.banCache.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.ban === "--disabled") return;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.ban === "--embed") {
            channel.buildEmbed()
                .setColor(0xFF0000)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Banned")
                .setTimestamp()
                .send()
                .catch(() => { return; });
        } else {
            channel.send(
                settings.logs.ban ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.ban) :
                    `**${user.tag}** has been banned from the server.`
            ).catch(() => { return; });
        }
    }
}

module.exports = New;
