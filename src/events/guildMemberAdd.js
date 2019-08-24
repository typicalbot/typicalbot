const Event = require("../structures/Event");

class GuildMemberAdd extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(member) {
        if (!member.guild.available) return;

        const guild = member.guild;
        const user = member.user;

        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.join !== "--disabled") {
            if (guild.channels.has(settings.logs.id)) {
                const channel = guild.channels.get(settings.logs.id);
                if (channel.type !== "text") return;

                if (settings.logs.join === "--embed") {
                    channel.buildEmbed()
                        .setColor(0x00FF00)
                        .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                        .setFooter("User Joined")
                        .setTimestamp()
                        .send()
                        .catch(() => { return; });
                } else {
                    channel.send(
                        settings.logs.join ?
                            this.client.functions.formatMessage("logs", guild, user, settings.logs.join) :
                            `**${user.username}#${user.discriminator}** has joined the server.`
                    ).catch(() => { return; });
                }
            }
        }

        if (settings.auto.message && !user.bot) user.send(`**${guild.name}'s Join Message:**\n\n${this.client.functions.formatMessage("automessage", guild, user, settings.auto.message)}`).catch(() => { return; });

        if (settings.auto.nickname) member.setNickname(this.client.functions.formatMessage("autonick", guild, user, settings.auto.nickname)).catch(() => { return; });

        let autorole;
        if (settings.auto.role.bots && member.author.bot) {
            autorole = settings.auto.role.bots ? guild.roles.has(settings.auto.role.bots) ? guild.roles.get(settings.auto.role.bots) : null : null;
        }
        else if (settings.auto.role.id) {
            autorole = settings.auto.role.id ? guild.roles.has(settings.auto.role.id) ? guild.roles.get(settings.auto.role.id) : null : null;
        }

        if (autorole && autorole.editable) setTimeout(() =>
            member.roles.add(autorole).then(() => {
                if (settings.auto.role.silent === "N" && settings.logs.id && guild.channels.has(settings.logs.id)) guild.channels.get(settings.logs.id).send(`**${user.tag}** was given the autorole **${autorole.name}**.`);
            }).catch(() => console.log("Missing Permissions")), settings.auto.role.delay || 2000
        );
    }
}

module.exports = GuildMemberAdd;
