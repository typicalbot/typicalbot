const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(oldMember, member) {
        const guild = member.guild;

        const oldNickname = oldMember.nickname;
        const nickname = member.nickname;
        if (oldNickname === nickname) return;

        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || !settings.logs.nickname) return;

        const user = member.user;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.auto.nickname && nickname === this.client.functions.formatMessage("jn", guild, user, settings.auto.nickname)) return;

        channel.send(
            settings.logs.nickname !== "--enabled" ?
                this.client.functions.formatMessage("ann-nick", guild, user, settings.logs.nickname, { oldMember }) :
                `**${user.tag}** changed their nickname to **${member.nickname || user.username}**.`
        ).catch(() => { return; });
    }
}

module.exports = New;
