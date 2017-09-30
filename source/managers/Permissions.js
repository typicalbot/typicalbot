class PermissionLevel { constructor(level, globalPermissions, title, check) { this.level = level; this.global = globalPermissions; this.title = title; this.check = check ? check : () => { return true; }; } }

module.exports = class {
    constructor(client) {
        this.client = client;

        this.levels = {

            "-1": new PermissionLevel(-1, false, "Server Blacklisted", (guild, member) => {
                const role = this.fetch(guild, "blacklist"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "0" : new PermissionLevel(0, false, "Server Member"),
            "1" : new PermissionLevel(1, false, "Server DJ", (guild, member) => {
                const role = this.fetch(guild, "dj"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "2" : new PermissionLevel(2, false, "Server Moderator", (guild, member) => {
                const role = this.fetch(guild, "moderator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "3" : new PermissionLevel(3, false, "Server Administrator", (guild, member) => {
                const role = this.fetch(guild, "administrator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "4" : new PermissionLevel(4, false, "Server Owner", (guild, member) => member.id === guild.ownerID),
            "8" : new PermissionLevel(8, false, "TypicalBot Support", (guild, id) => this.client.config.support[id]),
            "9" : new PermissionLevel(9, true, "TypicalBot Administrator", (guild, id) => this.client.config.administrators[id]),
            "10" : new PermissionLevel(10, true, "TypicalBot Creator", (guild, id) => id === client.config.creator),

        };
    }

    define(number) {
        return this.levels[number];
    }

    fetch(guild, permission) {
        const setting = guild.settings.roles[permission];
        if (!setting.length || !setting.filter(r => guild.roles.has(r)).length) {
            if (permission === "administrator") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot administrator");
            if (permission === "moderator") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot moderator");
            if (permission === "dj") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot dj");
            if (permission === "blacklist") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot blacklist");
        }

        return setting.filter(r => guild.roles.has(r)).map(r => guild.roles.get(r));
    }

    get(guild, member, globalIgnore = false) {
        const id = member.id ? member.id : member;

        if (this.levels[10].check(guild, id)) return this.define(10);
        if (this.levels[9].check(guild, id)) return this.define(9);
        if (!globalIgnore && this.levels[8].check(guild, id)) return this.define(8);

        member = guild.member(member);
        if (!member) return this.define(0);

        if (this.levels[4].check(guild, member)) return this.define(4);
        if (this.levels[3].check(guild, member)) return this.define(3);
        if (this.levels[2].check(guild, member)) return this.define(2);
        if (this.levels[1].check(guild, member)) return this.define(1);
        if (this.levels[-1].check(guild, member)) return this.define(-1);
        return this.define(0);
    }
};
