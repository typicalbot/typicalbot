const { Permissions } = require("discord.js");

module.exports = class {
    constructor(profile) {
        this.id = profile.id;
        this.username = profile.username;
        this.discriminator = profile.discriminator;
        this.avatarURL = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null;
        this.guilds = profile.guilds;
    }
};
