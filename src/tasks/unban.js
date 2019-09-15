const Task = require('../structures/Task');

module.exports = class extends Task {
    async execute() {
        const guild = this.client.guilds.get(this.guild); if (!guild) return;

        this.client.caches.unbans.set(this.user, { moderator: this.client.user, reason: "Automatic Unban: User's ban time has passed." });

        guild.members.unban(this.user, "Automatic Unban: User's ban time has passed.");
        this.tasks.delete(this.id);
    }
};
