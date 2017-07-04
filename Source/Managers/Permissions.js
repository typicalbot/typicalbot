class PermissionLevel { constructor(level, title, check) { this.level = level; this.title = title; this.check = check ? check : () => { return true; }; } }

module.exports = class {
    constructor(client) {
        this.client = client;

        this.levels = {

            "-1": new PermissionLevel(-1, "Server Blacklisted", (guild, member) => {
                const role = this.fetch(guild, "blacklist"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "0" : new PermissionLevel(0, "Server Member"),
            "1" : new PermissionLevel(1, "Server DJ", (guild, member) => {
                const role = this.fetch(guild, "dj"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "2" : new PermissionLevel(2, "Server Moderator", (guild, member) => {
                const role = this.fetch(guild, "moderator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "3" : new PermissionLevel(3, "Server Administrator", (guild, member) => {
                const role = this.fetch(guild, "administrator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            "4" : new PermissionLevel(4, "Server Owner", (guild, member) => member.id === guild.ownerID),
            "6" : new PermissionLevel(6, "TypicalBot Support", (guild, id) => this.client.config.support[id]),
            "7" : new PermissionLevel(7, "TypicalBot Staff", (guild, id) => this.client.config.staff[id]),
            "8" : new PermissionLevel(8, "TypicalBot Development Helper", (guild, id) => id === client.config.devhelp),
            "9" : new PermissionLevel(9, "TypicalBot Management", (guild, id) => this.client.config.management[id]),
            "10" : new PermissionLevel(10, "TypicalBot Creator", (guild, id) => id === client.config.owner),

        };
    }

    define(number) {
        return this.levels[number];
    }

    fetch(guild, permission) {
        const setting = guild.settings.roles[permission];
        if (!setting.length || !setting.filter(r => guild.roles.has(r)).length) {
            if (permission === "administrator") return guild.roles.find("name", "TypicalBot Administrator");
            if (permission === "moderator") return guild.roles.find("name", "TypicalBot Moderator");
            if (permission === "dj") return guild.roles.find("name", "TypicalBot DJ");
            if (permission === "blacklist") return guild.roles.find("name", "TypicalBot Blacklisted");
        }

        return setting.filter(r => guild.roles.has(r)).map(r => guild.roles.get(r));
    }

    get(guild, member, ignoreStaff = false) {
        const id = member.id ? member.id : member;

        if (this.levels[10].check(guild, id)) return this.define(10);
        if (this.levels[9].check(guild, id)) return this.define(9);
        if (this.levels[8].check(guild, id)) return this.define(8);
        if (!ignoreStaff && this.levels[7].check(guild, id)) return this.define(7);
        if (!ignoreStaff && this.levels[6].check(guild, id)) return this.define(6);

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
