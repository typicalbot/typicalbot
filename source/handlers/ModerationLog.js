const { MessageEmbed }      = require("discord.js");
const ModerationLogCase     = require("../structures/ModerationLogCase");

const Constants             = require(`../utility/Constants`);

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    get parse() {
        return ModerationLogCase.parse;
    }

    caseMatch(message) {
        const _case = message.embeds[0];

        const action = _case.description.match(Constants.ModerationLog.Regex.ACTION)[0];
        const user = _case.description.match(Constants.ModerationLog.Regex.USER)[0];
        const id = _case.footer.text;
        const ts = _case.createdAt;

        return { action, user, id, ts };
    }

    fetchChannel(guild) {
        return new Promise(async (resolve, reject) => {
            const settings = await this.client.settings.fetch(guild.id);

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
                channel.messages.fetch({ limit: 100 }).then(messages => {
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

                channel.messages.fetch({ limit: 100 }).then(messages => {
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

    buildCase(guild, data = {}) {
        return new ModerationLogCase(this.client, guild, data);
    }

    createLog(guild, { action, moderator, user, reason, length }) {
        return new Promise((resolve, reject) => {
            this.fetchChannel(guild).then(channel => {
                this.fetchLatest(guild).then(log => {
                    const last = log ? log.embeds[0].footer.text.match(/Case\s(\d+)/)[1] : 0;

                    const _action = `**Action:** ${action.display}${length ? ` (${this.client.functions.convertTime(length)})` : ""}`;
                    const _user = user.discriminator ? `**User:** ${user.username}#${user.discriminator} (${user.id})` : user.guild ? `**Channel:** ${user.name} (${user.toString()})` : "N/A";
                    const _case = Number(last) + 1;
                    const _reason = `**Reason:** ${reason || `Awaiting moderator's input. Use \`$reason ${_case} <reason>\`.`}`;

                    const embed = channel.buildEmbed()
                        .setColor(action.hex || 0xC4C4C4)
                        .setURL(Constants.Links.BASE)
                        .setDescription(`${_action}\n${_user}\n${_reason}`)
                        .setFooter(`Case ${_case}`, Constants.Links.ICON)
                        .setTimestamp();

                    if (moderator) embed.setAuthor(`${moderator.tag} (${moderator.id})`, moderator.avatarURL());

                    embed.send();

                    return resolve(_case);
                }).catch( reject );
            }).catch( reject );
        });
    }

    async edit(_case, moderator, reason) {
        const parsedCase = ModerationLogCase.parse(_case);

        parsedCase.setModerator(moderator);
        parsedCase.setReason(reason);

        _case.edit("", { embed: parsedCase.embed });

        return parsedCase._id;
    }
};
