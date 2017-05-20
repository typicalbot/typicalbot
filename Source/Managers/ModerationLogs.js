const RichEmbed = require("discord.js").RichEmbed;
const types = {
    warn: { color: 0xFFFF00, action: "Warn" },
    vmute: { color: 0xFF9900, action: "Voice Mute" },
    mute: { color: 0xFF9900, action: "Mute" },
    kick: { color: 0xFF3300, action: "Kick" },
    vkick: { color: 0xFF3300, action: "Voice Kick" },
    ban: { color: 0xFF0000, action: "Ban" },
    unban: { color: 0x006699, action: "Unban" },
    softban: { color: 0xFF2F00, action: "Softban" }
};

const regex = { action: /\*\*Action:\*\*\s.+/gi, user: /\*\*User:\*\*\s.+/gi };

class ModerationLog {
    constructor(client) {
        this.client = client;
    }

    caseMatch(message) {
        let _case = message.embeds[0];

        let action = _case.description.match(regex.action)[0];
        let user = _case.description.match(regex.user)[0];
        let id = _case.footer.text;
        let ts = _case.createdAt;

        return { action, user, id, ts };
    }

    fetchChannel(guild) {
        return new Promise(async (resolve, reject) => {
            let settings = await this.client.settingsManager.fetch(guild.id);

            let id = settings.modlogs;

            if (!id) return reject("Setting of modlogs is null.");

            let channel = guild.channels.get(id);
            if (!channel) return reject("Invalid channel.");

            return resolve(channel);
        });
    }

    fetchLatest(guild) {
        return new Promise((resolve, reject) => {
            this.fetchChannel(guild).then(channel => {
                channel.fetchMessages({ limit: 100 }).then(messages => {
                    let logs = messages.filter(m => {
                        if (m.author.id !== this.client.user.id) return false;
                        if (!m.embeds[0]) return false;
                        if (m.embeds[0].type !== "rich") return false;
                        if (!m.embeds[0].footer || !m.embeds[0].footer.text) return false;
                        if (!m.embeds[0].footer.text.startsWith("Case")) return false;
                        return true;
                    });

                    if (logs.size > 0) return resolve(logs.first());

                    return resolve();
                }).catch( reject );
            }).catch( reject );
        });
    }

    fetchCase(guild, id) {
        return new Promise((resolve, reject) => {
            this.fetchChannel(guild).then(channel => {
                if (id === "latest") return resolve(this.fetchLatest(guild));

                channel.fetchMessages({ limit: 100 }).then(messages => {
                    let logs = messages.filter(m => {
                        if (m.author.id !== this.client.user.id) return false;
                        if (!m.embeds[0]) return false;
                        if (m.embeds[0].type !== "rich") return false;
                        if (!m.embeds[0].footer || !m.embeds[0].footer.text) return false;
                        if (!m.embeds[0].footer.text.startsWith("Case")) return false;
                        if (m.embeds[0].footer.text === `Case ${id}`) return true;
                        return false;
                    });
                    if (logs.size > 0) return resolve(logs.first());
                    return resolve();
                }).catch( reject );
            }).catch( reject );
        });
    }

    createLog(guild, { action, moderator, user, reason }) {
        return new Promise((resolve, reject) => {
            this.fetchChannel(guild).then(channel => {
                this.fetchLatest(guild).then(log => {
                    let last = log ? log.embeds[0].footer.text.match(/Case\s(\d+)/)[1] : 0;

                    let type = types[action];

                    let _action = `**Action:** ${type.action}`;
                    let _user = `**User:** ${user.username}#${user.discriminator} (${user.id})`;
                    let _case = Number(last) + 1;
                    let _reason = `**Reason:** ${reason || `Awaiting moderator's input. Use \`$reason ${_case} <reason>\`.`}`;


                    let embed = new RichEmbed()
                        .setColor(type.color || 0xC4C4C4)
                        .setAuthor(moderator ? `${moderator.username}#${moderator.discriminator} (${moderator.id})` : null, moderator ? moderator.avatarURL : null)
                        .setURL(this.client.config.urls.website)
                        .setDescription(`${_action}\n${_user}\n${_reason}`)
                        .setFooter(`Case ${_case}`, "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg")
                        .setTimestamp();

                    return resolve(channel.send({embed}));
                }).catch( reject );
            }).catch( reject );
        });
    }

    editReason(_case, moderator, reason) {
        return new Promise((resolve, reject) => {
            let { action, user, id, ts } = this.caseMatch(_case);
            let _reason = `**Reason:** ${reason}`;

            let embed = new RichEmbed()
                .setColor(_case.embeds[0].color || 0xC4C4C4)
                .setAuthor(moderator ? `${moderator.username}#${moderator.discriminator} (${moderator.id})` : null, moderator ? moderator.avatarURL : null)
                .setURL(this.client.config.urls.website)
                .setDescription(`${action}\n${user}\n${_reason}`)
                .setFooter(id, "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg")
                .setTimestamp(ts);

            return resolve(_case.edit({embed}));
        });
    }
}

module.exports = ModerationLog;
