const Timer = require("../structures/Timer");

class New extends Timer {
    constructor(...args) {
        super(...args);

        this.client.database.get("mutes").then(data => data.forEach(e => this.set(e.id, e)));
    }

    async create(member, end) {
        //const id = 10e6 + Math.floor(Math.random() * (10e7 - 1));
        const id = `${member.guild.id}:${member.id}`;
        const newData = { id, end, "guild": member.guild.id, "member": member.id };

        await this.client.database.insert("mutes", newData);
        this.set(id, newData);

        return newData;
    }

    async delete(id) {
        await this.client.database.delete("mutes", id);
        super.delete(id);

        return;
    }

    async clear(member) {
        if (this.has(`${member.guild.id}:${member.id}`)) return this.delete(`${member.guild.id}:${member.id}`);
        
        return;
    }

    async execute(timer) {
        const guild = this.client.guilds.get(timer.guild); if (!guild) return;
        const member = await guild.members.fetch(timer.member); if (!member) return;

        const settings = await guild.fetchSettings();

        if (!member.roles.has(settings.roles.mute)) return this.delete(timer.id);

        member.removeRole(settings.roles.mute, "Automatic unmute.");
        return this.delete(timer.id);
    }
}

module.exports = New;
