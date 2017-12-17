const { MessageEmbed } = require("discord.js");

module.exports = class {
    constructor(client) { this.client = client; }

    async message(message) {
        const { type, data } = message;

        if (type === "stats") {
            this.client.shardData = data;
        } else if (type === "reload") {
            this.client.reload(data);
        } else if (type === "transmitTesters") {
            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        } else if (type === "testers") {
            this.client.testerData = data;
        } else if (type === "message") {
            if (!this.client.channels.has(data.channel)) return;

            const channel = this.client.channels.get(data.channel);
            const options = data.embed ? { embed: data.embed } : {};

            channel.send(data.content, options).catch(err => channel.send(`An error occued while executing an external message.`));
        } else if (type === "globaleval") {
            try { this.client.log(eval(data.code)); }
            catch(err) { this.client.log(err, true); }
        } else if (type === "guildData") {
            console.log("GUILD_DATA");
            if (!this.client.guilds.has(data.guild)) return;

            const guild = this.client.guilds.get(data.guild);
            const settings = await this.client.settings.fetch(data.guild);

            const guildOwner = await this.client.users.fetch(guild.ownerID);

            this.client.transmit("masterrequest", {
                id: data.id,
                guild: {
                    name: guild.name,
                    id: guild.id,
                    shard: `${this.client.shardNumber}/${this.client.shardCount} (${this.client.shardID})`,
                    icon: guild.icon,
                    roles: guild.roles.map(r => ({ name: r.name, id: r.id, position: r.position, hoist: r.hoist, permissions: r.permissions, mentionable: r.mentionable })),
                    memberCount: guild.memberCount,
                    channels: guild.channels.map(c => ({ name: c.name, id: c.id, position: c.position, type: c.type })),
                    owner: { username: guildOwner.username, id: guildOwner.id, discriminator: guildOwner.discriminator },
                    settings
                }
            });
        } else if (type === "userData") {
            if (!this.client.guilds.has(data.guild)) return;

            const guild = this.client.guilds.get(data.guild);
            guild.settings = await this.client.settings.fetch(data.guild);

            const permissions = this.client.permissionsManager.get(guild, data.user);

            this.client.transmit("masterrequest", {
                id: data.id,
                permissions
            });
        } else if (type === "leaveGuild") {
            if (!this.client.guilds.has(data.guild)) return;

            this.client.guilds.get(data.guild).leave();

            this.client.transmit("masterrequest", {
                id: data.id,
            });
        }
    }
};
