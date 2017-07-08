const MessageEmbed = require("discord.js").MessageEmbed;
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

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    caseMatch(message) {
        const _case = message.embeds[0];

        const action = _case.description.match(regex.action)[0];
        const user = _case.description.match(regex.user)[0];
        const id = _case.footer.text;
        const ts = _case.createdAt;

        return { action, user, id, ts };
    }

    fetchChannel(guild) {
        return new Promise(async (resolve, reject) => {
            const settings = await this.client.settingsManager.fetch(guild.id);

            const id = settings.logs.moderation;

            if (!id) return reject("Setting of modlogs is null.");

            const channel = guild.channels.get(id);
            if (!channel) return reject("Invalid channel.");

            return resolve(channel);
        });
    }

    fetchLatest(guild) {
        return new Promise((resolve, reject) => {
            this.fetchChannel(guild).then(channel => {
                channel.fetchMessages({ limit: 100 }).then(messages => {
                    const logs = messages.filter(m => {
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
                    const logs = messages.filter(m => {
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
                    const last = log ? log.embeds[0].footer.text.match(/Case\s(\d+)/)[1] : 0;

                    const type = types[action];

                    const _action = `**Action:** ${type.action}`;
                    const _user = `**User:** ${user.username}#${user.discriminator} (${user.id})`;
                    const _case = Number(last) + 1;
                    const _reason = `**Reason:** ${reason || `Awaiting moderator's input. Use \`$reason ${_case} <reason>\`.`}`;


                    const embed = channel.buildEmbed()
                        .setColor(type.color || 0xC4C4C4)
                        .setURL(this.client.config.urls.website)
                        .setDescription(`${_action}\n${_user}\n${_reason}`)
                        .setFooter(`Case ${_case}`, "https://typicalbot.com/images/icon.png")
                        .setTimestamp();

                    if (moderator) embed.setAuthor(`${moderator.tag} (${moderator.id})`, moderator.avatarURL());

                    embed.send();

                    return resolve(_case);
                }).catch( reject );
            }).catch( reject );
        });
    }

    editReason(_case, moderator, reason) {
        return new Promise((resolve, reject) => {
            const { action, user, id, ts } = this.caseMatch(_case);
            const _reason = `**Reason:** ${reason}`;

            const embed = new MessageEmbed()
                .setColor(_case.embeds[0].color || 0xC4C4C4)
                .setURL(this.client.config.urls.website)
                .setDescription(`${action}\n${user}\n${_reason}`)
                .setFooter(id, "https://typicalbot.com/images/icon.png")
                .setTimestamp(ts);

            if (moderator) embed.setAuthor(`${moderator.tag} (${moderator.id})`, moderator.avatarURL());

            _case.edit("", { embed });

            return resolve(id);
        });
    }
};
