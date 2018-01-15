const Task = require("../structures/Task");

module.exports = class extends Task {
    constructor(...args) {
        super(...args);
    }

    async execute() {
        const guild = this.client.guilds.get(this.guild); if (!guild) return;
        const member = await guild.members.fetch(this.member).catch(err => this.delete(this.id)); if (!member) return;

        const settings = await guild.fetchSettings();

        if (!settings.roles.mute || !member.roles.has(settings.roles.mute) || !guild.roles.get(settings.roles.mute).editable) return this.timers.delete(this.id);

        const log = { "action": "UNMUTE", "user": member.user, "moderator": this.client.user, "reason": "Automatic Unmute: User's mute time has passed." };
        await this.client.moderationLog.createLog(guild, log);

        member.removeRole(settings.roles.mute, "Automatic Unmute: User's mute time has passed.");
        return this.timers.delete(this.id);
    }
};