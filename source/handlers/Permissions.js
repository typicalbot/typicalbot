const Constants = require("../utility/Constants");

class PermissionLevel { constructor(level, title, check) { this.level = level; this.title = title; this.check = check ? check : () => { return true; }; } }

class PermissionsHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.levels = {

            [Constants.Permissions.SERVER_BLACKLISTED]: new PermissionLevel(Constants.Permissions.SERVER_BLACKLISTED, "Server Blacklisted", (guild, member) => {
                const role = this.fetchRoles(guild, "blacklist"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            [Constants.Permissions.SERVER_MEMBER] : new PermissionLevel(Constants.Permissions.SERVER_MEMBER, "Server Member"),
            [Constants.Permissions.SERVER_DJ] : new PermissionLevel(Constants.Permissions.SERVER_DJ, "Server DJ", (guild, member) => {
                const role = this.fetchRoles(guild, "dj"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            [Constants.Permissions.SERVER_MODERATOR] : new PermissionLevel(Constants.Permissions.SERVER_MODERATOR, "Server Moderator", (guild, member) => {
                const role = this.fetchRoles(guild, "moderator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            [Constants.Permissions.SERVER_ADMINISTRATOR] : new PermissionLevel(Constants.Permissions.SERVER_ADMINISTRATOR, "Server Administrator", (guild, member) => {
                const role = this.fetchRoles(guild, "administrator"); if (!role) return;
                if (role instanceof Array) { let isRole = false; role.forEach(r => { if (member.roles.has(r.id)) isRole = true; }); return isRole; } else { return member.roles.has(role.id); }
            }),
            [Constants.Permissions.SERVER_OWNER] : new PermissionLevel(Constants.Permissions.SERVER_OWNER, "Server Owner", (guild, member) => member.id === guild.ownerID),
            [Constants.Permissions.TYPICALBOT_SUPPORT] : new PermissionLevel(Constants.Permissions.TYPICALBOT_SUPPORT, "TypicalBot Support", (guild, id) => this.client.config.support[id]),
            [Constants.Permissions.TYPICALBOT_ADMINISTRATOR] : new PermissionLevel(Constants.Permissions.TYPICALBOT_ADMINISTRATOR, "TypicalBot Administrator", (guild, id) => this.client.config.administrators[id]),
            [Constants.Permissions.TYPICALBOT_CREATOR] : new PermissionLevel(Constants.Permissions.TYPICALBOT_CREATOR, "TypicalBot Creator", (guild, id) => id === client.config.creator),

        };
    }

    define(number) {
        return this.levels[number];
    }

    fetchRoles(guild, permission) {
        const setting = guild.settings.roles[permission];
        if (!setting.length || !setting.filter(r => guild.roles.has(r)).length) {
            if (permission === "administrator") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot administrator");
            if (permission === "moderator") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot moderator");
            if (permission === "dj") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot dj");
            if (permission === "blacklist") return guild.roles.find(r => r.name.toLowerCase() === "typicalbot blacklist");
        }

        return setting.filter(r => guild.roles.has(r)).map(r => guild.roles.get(r));
    }

    fetch(guild, member, globalIgnore = false) {
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
}

module.exports = PermissionsHandler;