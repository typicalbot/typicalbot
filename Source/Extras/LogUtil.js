const colors = { Warn: 0xFFFF00, Mute: 0xFF9900, Kick: 0xFF3300, Ban: 0xFF0000, Unban: 0x006699 };
const regex = { action: /\*\*Action:\*\*\s.+/gi, user: /\*\*User:\*\*\s.+/gi };
const _ = {};
let client;

_.setup = _client => client = _client;

_.case = message => {
    let _case = message.embeds[0];

    let action = _case.description.match(regex.action)[0];
    let user = _case.description.match(regex.user)[0];
    let id = _case.footer.text;
    let ts = _case.createdAt;

    return { action, user, id, ts };
};

_.channel = guild => {
    return new Promise((resolve, reject) => {
        client.settings.get(guild).then(settings => {
            let id = settings.modlogs;
            if (!id) return reject("Setting of modlogs is null.");
            let channel = guild.channels.get(id);
            if (!channel) return reject("Invalid channel.");
            return resolve(channel);
        }).catch( reject );
    });
};

_.latest = guild => {
    return new Promise((resolve, reject) => {
        _.channel(guild).then(channel => {
            channel.fetchMessages({ limit: 100 }).then(messages => {
                let logs = messages.filter(m => {
                    if (m.author.id !== client.bot.user.id) return false;
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
};

_.get = (guild, id) => {
    return new Promise((resolve, reject) => {
        _.channel(guild).then(channel => {
            if (id === "latest") return resolve(_.latest(guild));
            channel.fetchMessages({ limit: 100 }).then(messages => {
                let logs = messages.filter(m => {
                    if (m.author.id !== client.bot.user.id) return false;
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
};

_.log = (guild, { action, moderator, user, reason }) => {
    return new Promise((resolve, reject) => {
        _.channel(guild).then(channel => {
            _.latest(guild).then(log => {
                let last = log ? log.embeds[0].footer.text.match(/Case\s(\d+)/)[1] : 0;

                let _action = `**Action:** ${action}`;
                let _user = `**User:** ${user.username}#${user.discriminator} (${user.id})`;
                let _case = Number(last) + 1;
                let _reason = `**Reason:** ${reason || `Awaiting moderator's input. Use \`$reason ${_case} <reason>\`.`}`;

                let embed = {
                    "color": colors[action] || 0xC4C4C4,
                    "description": `${_action}\n${_user}\n${_reason}`,
                    "author": {
                        "url": client.config.urls.website,
                        "name": moderator ? `${moderator.username}#${moderator.discriminator} (${moderator.id})` : null,
                        "icon_url": moderator ? moderator.avatarURL : null,
                    },
                    "timestamp": new Date(),
                    "footer": {
                        "text": `Case ${_case}`,
                        "icon_url": "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg"
                    }
                };

                return resolve(channel.sendMessage("", { embed }));
            }).catch( reject );
        }).catch( reject );
    });
};

_.reason = (_case, moderator, reason) => {
    return new Promise((resolve, reject) => {
        let { action, user, id, ts } = _.case(_case);
        let _reason = `**Reason:** ${reason}`;

        let embed = {
            "color": colors[action.slice(12)] || 0xC4C4C4,
            "description": `${action}\n${user}\n${_reason}`,
            "author": {
                "url": client.config.urls.website,
                "name": moderator ? `${moderator.username}#${moderator.discriminator} (${moderator.id})` : null,
                "icon_url": moderator ? moderator.avatarURL : null,
            },
            "timestamp": ts,
            "footer": {
                "text": id,
                "icon_url": "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg"
            }
        };

        return resolve(_case.edit("", { embed }));
    });
};

module.exports = _;
