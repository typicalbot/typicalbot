const { MessageEmbed } = require("discord.js");
const ModerationLog = require("../structures/ModerationLog");

const Constants = require(`../utility/Constants`);

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    async fetchChannel(guild) {
        const settings = await guild.fetchSettings();

        if (!settings.logs.moderation) throw "No moderation log channel is set.";
        if (!guild.channels.has(settings.logs.moderation)) throw "Channel does not exist.";

        return guild.channels.get(settings.logs.moderation);
    }

    async fetchCase(guild, id = "latest") {
        const channel = this.fetchChannel(guild);

        const messages = channel.messages.fetch({ limit: 100 })
            .catch(() => { throw "Couldn't fetch messages."; });

        const filteredLogs = messages.filter(
            m =>
                m.author.id === this.client.user.id &&
                m.embeds.length &&
                m.embeds[0].type === "rich" &&
                m.embeds[0].footer &&
                m.embeds[0].footer.text &&
                m.embeds[0].footer.text.startsWith("Case ")
        );

        if (id === "latest") return filteredLogs.first();

        return filteredLogs.find(m => m.embeds[0].footer.text === `Case ${id}`);
    }

    buildCase(guild, data = {}) {
        return new ModerationLog(this.client, guild, data);
    }

    async edit(_case, moderator, reason) {
        const parsedCase = ModerationLog.parse(_case);

        parsedCase.setModerator(moderator);
        parsedCase.setReason(reason);

        _case.edit("", { embed: parsedCase.embed });

        return parsedCase._id;
    }
};
