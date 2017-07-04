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
        } else if (type === "transmitDonors") {
            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitDonors();
        } else if (type === "testers") {
            this.client.testerData = data;
        } else if (type === "donors") {
            this.client.donorData = data;
        } else if (type === "message") {
            if (!this.client.channels.has(data.channel)) return;

            const channel = this.client.channels.get(data.channel);
            const options = data.embed ? { embed: data.embed } : {};

            channel.send(data.content, options).catch(err => channel.send(`An error occued while executing an external message.`));
        } else if (type === "guildinfo") {
            if (!this.client.guilds.has(data.guild)) return;

            const guild = this.client.guilds.get(data.guild);
            const settings = await this.client.settingsManager.fetch(data.guild);

            const guildOwner = await this.client.fetchUser(guild.ownerID);

            this.client.transmit("masterrequest", {
                "id": data.id,
                "guild": {
                    "name": guild.name,
                    "id": guild.id,
                    "shard": `${this.client.shardNumber}/${this.client.shardCount} (${this.client.shardID})`,
                    "icon": guild.icon,
                    "roles": guild.roles.map(r => ({ "name": r.name, "id": r.id, "position": r.position, "hoist": r.hoist, "permissions": r.permissions, "mentionable": r.mentionable })),
                    "memberCount": guild.memberCount,
                    "channels": guild.channels.map(c => ({ "name": c.name, "id": c.id, "position": c.position, "type": c.type })),
                    "owner": { "username": guildOwner.username, "id": guildOwner.id, "discriminator": guildOwner.discriminator },
                    settings
                }
            });
        } else if (type === "inguild") {
            if (!this.client.guilds.has(data.guild)) return;

            this.client.transmit("masterrequest", {
                id: data.id
            });
        } else if (type === "leaveguild") {
            if (!this.client.guilds.has(data.guild)) return;

            this.client.guilds.get(data.guild).leave();
        } else if (type === "userlevel") {
            if (!this.client.guilds.has(data.guild)) return;

            const guild = this.client.guilds.get(data.guild);
            guild.settings = await this.client.settingsManager.fetch(data.guild);

            const permissions = this.client.permissionsManager.get(guild, data.user);

            this.client.transmit("masterrequest", {
                "id": data.id,
                permissions
            });
        } else if (type === "staffposition") {
            if (!this.client.guilds.has("163038706117115906")) return;

            const guild = this.client.guilds.get("163038706117115906");
            const user = guild.member(data.user);

            const roles = [];

            user.roles.sort((a, b) => b.position - a.position).forEach(r => {
                if (["163039088243507200", "278955494272663552", "193487705844350976", "193578559057559562", "193486573067567104", "301392622763638785"]
                    .includes(r.id)) roles.push({ name: r.name, id: r.id, hexColor: r.hexColor });
            });

            this.client.transmit("masterrequest", {
                "id": data.id,
                roles
            });
        } else if (type === "globaleval") {
            try { this.client.log(eval(data.code)); }
            catch(err) { this.client.log(err, true); }
        }
    }
};

/*
if (message.type === "serverinfo") {
    if (!this.client.guilds.has(message.data.guild)) return;
    const guild = this.client.guilds.get(message.data.guild);
    const owner = guild.owner ? guild.owner.user : guild.member(guild.ownerID).user;

    this.client.settingsManager.fetch(guild.id).then(settings => {
        let settingslist = [];
        Object.keys(settings).map(s => settingslist.push(`${s}: \`${settings[s]}\``));

        message.data.settings ?
            this.client.transmit("channelmessage", {
                "embed": true,
                "channel": message.data.channel,
                "content": {
                    "color": 0x00adff,
                    "description": `**__Guild:__**\n${guild.name} | ${guild.id}\n\n**__Owner:__**\n${owner.username}#${owner.discriminator} | ${owner.id}\n\n`
                    + `**__Settings:__**\n${settingslist.join(", ")}`,
                    "footer": { "text": "TypicalBot Support", "icon_url": "https://typicalbot.com/images/icon.png" },
                    "timestamp": new Date()
                }
            }) :
            this.client.transmit("channelmessage", {
                "embed": true,
                "channel": message.data.channel,
                "content": {
                    "color": 0x00adff,
                    "description": `**__Guild:__**\n${guild.name} | ${guild.id}\n\n**__Owner:__**\n${owner.username}#${owner.discriminator} | ${owner.id}\n\n`
                    + `**__Stats:__**\n**Members:** ${guild.memberCount}\n**Shard:** ${this.client.shardID}\n\n`
                    + `**__Roles:__**\n${guild.roles.map(r => `\`${r.name} (${r.position})\``).join(", ")}\n\n`
                    + `**__Channels:__**\n**Text:** ${guild.channels.filter(c => c.type === "text").map(c => `\`${c.name}\``).join(", ")}\n**Voice:** ${guild.channels.filter(c => c.type === "voice").map(c => `\`${c.name}\``).join(", ")}`,
                    "footer": { "text": "TypicalBot Support", "icon_url": "https://typicalbot.com/images/icon.png" },
                    "timestamp": new Date()
                }
            });
    });
} else
*/
