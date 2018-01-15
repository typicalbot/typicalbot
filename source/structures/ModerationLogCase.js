class ModerationLogCase {
    constructor(client, guild, { action, moderator, user, channel, reason, expiration }) {
        Object.defineProperty(this, "client", { value: client });

        this.guild = guild;

        this.action = action;

        this.moderator = moderator;

        this.user = user;

        this.channel = channel;

        this.reason = reason;

        this.expiration = expiration;
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

    async send() {
        const channel = await this.client.modlogsManager.fetchChannel(this.guild).catch(err => { throw err; });
        const latest = await this.client.modlogsManager.fetchLatest(this.guild).catch(err => { throw err; });

        const type = this.client.modlogsManager.types[this.action];

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

        message.send();

        return _case;
    }
}

module.exports = ModerationLogCase;
