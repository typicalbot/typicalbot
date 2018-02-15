const Task = require("../structures/Task");
const Constants = require(`../utility/Constants`);

module.exports = class extends Task {
    constructor(...args) {
        super(...args);
    }

    async execute() {
        const guild = this.client.guilds.get(this.guild); if (!guild) return;

        this.client.caches.unbans.set(this.user, { "moderator": this.client.user, "reason": "Automatic Unban: User's ban time has passed." });

        guild.members.unban(this.user, "Automatic Unban: User's ban time has passed.");
        return this.tasks.delete(this.id);
    }
};