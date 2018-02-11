const Constants = require("../utility/Constants");

class PermissionLevel {
    constructor({ title, level, staff = false, check = () => true}) {
        this.title = title;

        this.level = level;

        this.staff = staff;

        this.check = check;
    }

    static fetchRoles(guild, permission) {
        const setting = guild.settings.roles[permission];

        const pool = setting.filter(r => guild.roles.has(r));
        
        const permRole = guild.roles.find(r => r.name.toLowerCase() === Constants.Permissions.RoleTitles[permission.toUpperCase()]);
        if (permRole) pool.push(permRole.id);

        return pool;
    }
}

module.exports = PermissionLevel;