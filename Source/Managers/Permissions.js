class PermissionLevel { constructor(level, title, check) { this.level = level; this.title = title; this.check = check ? check : () => { return true; }; } }

class PermissionLevels {
    constructor(client) {
        this.client = client;

        this.levels = {

            "-1": new PermissionLevel(-1, "Server Blacklisted", (guild, member) => {
                let role = this.fetchRole(guild, "blacklistrole"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole;
                } else return member.roles.has(role.id);
            }),
            "0" : new PermissionLevel(0, "Server Member"),
            "1" : new PermissionLevel(1, "Server DJ", (guild, member) => {
                let role = this.fetchRole(guild, "djrole"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole;
                } else return member.roles.has(role.id);
            }),
            "2" : new PermissionLevel(2, "Server Moderator", (guild, member) => {
                let role = this.fetchRole(guild, "modrole"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole;
                } else return member.roles.has(role.id);
            }),
            "3" : new PermissionLevel(3, "Server Administrator", (guild, member) => {
                let role = this.fetchRole(guild, "adminrole"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole;
                } else return member.roles.has(role.id);
            }),
            "4" : new PermissionLevel(4, "Server Owner", (guild, member) => member.id === guild.ownerID),
            "7" : new PermissionLevel(7, "TypicalBot Support", (guild, member) => this.client.config.support[member.id]),
            "8" : new PermissionLevel(8, "TypicalBot Staff", (guild, member) => this.client.config.staff[member.id]),
            "9" : new PermissionLevel(9, "TypicalBot Management", (guild, member) => this.client.config.management[member.id]),
            "10" : new PermissionLevel(10, "TypicalBot Creator", (guild, member) => member.id === client.config.owner),

        };
    }

    define(number) {
        return this.levels[number];
    }

    fetchRole(guild, permission) {
        let roleSetting = guild.settings[permission];
        if (!roleSetting) {
            if (permission === "adminrole") return guild.roles.find("name", "TypicalBot Administrator");
            if (permission === "modrole") return guild.roles.find("name", "TypicalBot Moderator");
            if (permission === "djrole") return guild.roles.find("name", "TypicalBot DJ");
            if (permission === "blacklistrole") return guild.roles.find("name", "TypicalBot Blacklisted");
        }

        if (roleSetting.includes(";")) return roleSetting.split(";").filter(r => guild.roles.has(r)).map(r => guild.roles.get(r));
        return guild.roles.get(roleSetting);
    }

    get(guild, user, ignoreStaff = false) {
        let member = guild.member(user);
        if (!member) return this.define(0);

        if (this.levels[10].check(guild, member)) return this.define(10);
        if (this.levels[9].check(guild, member)) return this.define(9);
        if (!ignoreStaff && this.levels[8].check(guild, member)) return this.define(8);
        if (!ignoreStaff && this.levels[7].check(guild, member)) return this.define(7);

        if (this.levels[4].check(guild, member)) return this.define(4);
        if (this.levels[3].check(guild, member)) return this.define(3);
        if (this.levels[2].check(guild, member)) return this.define(2);
        if (this.levels[1].check(guild, member)) return this.define(1);
        if (this.levels[-1].check(guild, member)) return this.define(-1);
        return this.define(0);
    }
}

module.exports = PermissionLevels;
