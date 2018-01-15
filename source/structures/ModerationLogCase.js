const Constants = require(`../utility/Constants`);
const { MessageEmbed } = require("discord.js");

class ModerationLogCase {
    constructor(client, guild, { id, action, _action, moderator, user, channel, reason, expiration, timestamp }) {
        Object.defineProperty(this, "client", { value: client });

        this.guild = guild;

        this.id = id;

        this._id = id ? id.match(Constants.ModerationLog.Regex.CASE)[1] : null;
        
        this.action = action;

        this._action = _action;

        this.moderator = moderator;

        this.user = user;

        this.channel = channel;

        this.reason = reason;

        this.expiration = expiration;

        this.timestamp = timestamp;
    }

    setId(data) {
        this._id = data;
        this.id = `Case ${data}`;
        return this;
    }

    setAction(data) {
        this._action = data;
        this.action = `**Action:** ${data.display}${this.expiration ? ` (${this.client.functions.convertTime(this.expiration)})` : ""}`;
        return this;
    }

    setModerator(data) {
        this.moderator = { display: `${data.tag} (${data.id})`, icon: data.displayAvatarURL() };
        return this;
    }

    setUser(data) {
        this.user = `**User:** ${data.tag} (${data.id})`;
        return this;
    }

    setChannel(data) {
        this.channel = `**Channel:** ${data.name} (${data.toString()})`;
        return this;
    }

    setReason(data) {
        this.reason = `**Reason:** ${data}`;
        return this;
    }

    setExpiration(data) {
        this.expiration = data;
        return this;
    }

    setTimestamp(data) {
        this.timestamp = data;
        return this;
    }

    get embed() {
        const embed = new MessageEmbed()
            .setColor(this._action.hex)
            .setURL(this.client.config.urls.website)
            .setDescription(`${this.action}\n${this.channel || this.user}\n${this.reason || `**Reason:** Awaiting moderator's input. Use \`$reason ${this.id} <reason>\`.`}`)
            .setFooter(this.id, "https://typicalbot.com/x/images/icon.png")
            .setTimestamp(this.timestamp);

        if (this.moderator) embed.setAuthor(this.moderator.display, this.moderator.icon);

        return embed;
    }

    async send() {
        const channel = await this.client.moderationLog.fetchChannel(this.guild).catch(err => { throw err; });
        const latest = await this.client.moderationLog.fetchLatest(this.guild).catch(err => { throw err; });
        
        if (!this.id) this.setId(latest ? Number(latest.embeds[0].footer.text.match(Constants.ModerationLog.Regex.CASE)[1]) + 1 : 1);

        const embed = this.embed;

        channel.send("", { embed });

        return this.id;
    }

    static parse(message) {
        const embed = message.embeds[0];

        const id = embed.footer.text;
        const action = embed.description.match(Constants.ModerationLog.Regex.ACTION)[0];
        const _action = Object.entries(Constants.ModerationLog.Types).filter(e => e[1].display === /\*\*Action:\*\*\s(.+)/gi.exec(action)[1])[0][1];
        const moderator = embed.author ? { display: embed.author.name, icon: embed.author.iconURL } : null;
        const user = embed.description.match(Constants.ModerationLog.Regex.USER)[0];
        const _reason = embed.description.match(Constants.ModerationLog.Regex.REASON); 
        const reason = _reason ? _reason[0] : null;
        const timestamp = embed.createdAt;

        const data = { id, action, _action, user, timestamp };
        
        if (moderator) Object.assign(data, { moderator });
        if (reason) Object.assign(data, { reason });

        return new ModerationLogCase(message.client, message.guild, data);
    }
}

module.exports = ModerationLogCase;
