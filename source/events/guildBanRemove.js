const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(guild, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);

        if (settings.logs.moderation && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.unbanCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "unban", user }, cachedLog));
            this.client.unbanCache.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.unban === "--disabled") return;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.unban === "--embed") {
            channel.buildEmbed()
                .setColor(0x3EA7ED)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Unbanned")
                .setTimestamp()
                .send()
                .catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.logs.unban ?
                    this.client.functions.formatMessage.execute("logs", guild, user, settings.logs.unban) :
                    `**${user.tag}** has been unbanned from the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }
}

module.exports = New;
