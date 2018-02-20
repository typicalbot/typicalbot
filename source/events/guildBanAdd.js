const Event = require("../structures/Event");
const Constants = require(`../utility/Constants`);

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, user) {
        if (!guild.available) return;
        
        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.moderation && !this.client.caches.softbans.has(user.id)) {
            const cachedLog = this.client.caches.bans.get(user.id);

            const newCase = this.client.handlers.moderationLog.buildCase(guild).setAction(Constants.ModerationLog.Types.BAN).setUser(user);
            if (cachedLog) {
                newCase.setModerator(cachedLog.moderator);
                if (cachedLog.reason) newCase.setReason(cachedLog.reason);
                if (cachedLog.expiration) newCase.setExpiration(cachedLog.expiration);
            } newCase.send();

            this.client.caches.bans.delete(user.id);
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
