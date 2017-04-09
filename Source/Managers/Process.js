class ProcessManager {
    constructor(client) { this.client = client; }
    
    message(message) {
        if (message.type === "stats") {
            this.client.shardData = message.data;
        } else if (message.type === "reload") {
            this.client.reload(message.data);
        } else if (message.type === "donors") {
            this.client.donorData = message.data;
        } else if (message.type === "channelmessage") {
            if (!this.client.channels.has(message.data.channel)) return;
            let channel = this.client.channels.get(message.data.channel);
            message.data.embed ?
                channel.sendMessage("", { embed: message.data.content }).catch(err => channel.sendMessage("A message was too big to send here.")) :
                channel.sendMessage(message.data.content);
        } else if (message.type === "serverinfo") {
            if (!this.client.guilds.has(message.data.guild)) return;
            let guild = this.client.guilds.get(message.data.guild);
            let owner = guild.owner ? guild.owner.user : guild.member(guild.ownerID).user;

            this.client.settings.get(guild.id).then(settings => {
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
        } else if (message.type === "shardping") {
            if (message.data.shard != this.client.shardID) return;
            this.client.transmit("channelmessage", {
                "embed": true,
                "channel": message.data.channel,
                "content": {
                    "color": 0x00FF00,
                    "description": `Shard ${+this.client.shardID + 1} / ${this.client.shardCount} is online. ${Date.now() - message.data.timestamp}ms`,
                    "footer": { "text": "TypicalBot Monitor", "icon_url": "https://typicalbot.com/images/icon.png" },
                    "timestamp": new Date()
                }
            });
        } else if (message.type === "eval") {
            try { this.client.log(eval(message.data.code)); }
            catch(err) { this.client.log(err, true); }
        }
    }
}

module.exports = ProcessManager;
