const Task = require("../structures/Task");

module.exports = class extends Task {
    constructor(...args) {
        super(...args);
    }

    async execute() {
        const guild = this.client.guilds.get(this.guild);

        if (!guild) await this.client.handlers.settings.delete(this.guild);

        return this.tasks.delete(this.id);
    }
};
