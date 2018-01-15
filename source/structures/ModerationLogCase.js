const Constants = require(`../utility/Constants`);

class ModerationLogCase {
    constructor(client, guild, { action, id, moderator, user, channel, reason, expiration, timestamp }) {
        Object.defineProperty(this, "client", { value: client });

        this.guild = guild;

        this.action = action;

        this.id = id;

        this.moderator = moderator;

        this.user = user;

        this.channel = channel;

        this.reason = reason;

        this.expiration = expiration;

        this.timestamp = timestamp;
    }

    setAction(newData) {
        this.action = newData;
        return this;
    }

    setModerator(newData) {
        this.moderator = newData;
        return this;
    }

    setUser(newData) {
        this.user = newData;
        return this;
    }

    setChannel(newData) {
        this.channel = newData;
        return this;
    }

    setReason(newData) {
        this.reason = newData;
        return this;
    }

    setExpiration(newData) {
        this.expiration = newData;
        return this;
    }

    async embed() {
        const channel = await this.client.moderationLog.fetchChannel(this.guild).catch(err => { throw err; });
        const latest = await this.client.moderationLog.fetchLatest(this.guild).catch(err => { throw err; });

        const type = Constants.ModerationLog.Types[this.action];

        const _action = `**Action:** ${type.action}${this.length ? ` (${this.client.functions.convertTime(this.length)})` : ""}`;
        const _user = this.user ? `**User:** ${this.user.tag} (${this.user.id})` : this.channel ? `**Channel:** ${this.user.name} (${this.user.toString()})` : "N/A";
        const _case = latest ? Number(latest.embeds[0].footer.text.match(/Case\s(\d+)/)[1]) + 1 : 1;
        const _reason = `**Reason:** ${this.reason || `Awaiting moderator's input. Use \`$reason ${_case} <reason>\`.`}`;

        const message = channel.buildEmbed()
            .setColor(type.color || 0xC4C4C4)
            .setURL(this.client.config.urls.website)
            .setDescription(`${_action}\n${_user}\n${_reason}`)
            .setFooter(`Case ${_case}`, "https://typicalbot.com/x/images/icon.png")
            .setTimestamp();

        if (this.moderator) message.setAuthor(`${this.moderator.tag} (${this.moderator.id})`, this.moderator.displayAvatarURL());

        return message;
    }

    async send() {
        return await this.embed().send();
    }

    static parse(message) {
        const embed = message.embeds[0];

        const action = embed.description.match(Constants.ModerationLog.Regex.ACTION)[0];
        const id = embed.footer.text;
        const moderator = embed.author ? { display: embed.author.name, icon: embed.author.iconURL } : null;
        const user = embed.description.match(Constants.ModerationLog.Regex.USER)[0];
        const reason = embed.description.match(Constants.ModerationLog.Regex.REASON)[0];
        const timestamp = embed.createdAt;

        return new ModerationLogCase(message.client, message.guild, { action, id, moderator, user, reason, timestamp });
    }
}

module.exports = ModerationLogCase;
