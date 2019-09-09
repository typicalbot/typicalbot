const moment = require('moment');
const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays a user's information.",
            usage: "userinfo [@user|user-id|user-tag]",
            aliases: ["uinfo", "whois"],
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const { user } = member;

        message.reply(
            `**__${user.tag}__**\n`
            + `\`\`\`\n`
            + `ID                  : ${user.id}\n`
            + `Status              : ${user.presence.status}\n`
            + `Avatar              : ${user.avatarURL("png", 2048)}\n`
            + `Joined              : ${moment(member.joinedAt).format('MMM DD, YYYY hh:mm A')}\n`
            + `Registered          : ${moment(user.createdAt).format('MMM DD, YYYY hh:mm A')}\n`
            + (member.roles.size > 1 ? `Roles               : ${member.roles.array().filter(r => r.position !== 0).sort((a, b) => b.position - a.position).map(r => r.name).join(', ')}\n` : 'None')
            + `\`\`\``
        );
    }

    async embedExecute(message, parameters) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const { user } = member;

        message.buildEmbed()
            .setAuthor(user.tag, user.avatarURL('png', 2048))
            .setThumbnail(user.avatarURL('png', 2048))
            .addField('ID', user.id, true)
            .addField('Status', user.presence.status, true)
            .addField('Joined', moment(member.joinedAt).format('MMM DD, YYYY hh:mm A'), true)
            .addField('Registered', moment(user.createdAt).format('MMM DD, YYYY hh:mm A'), true)
            .addField(`Roles (${member.roles.size - 1})`, `${member.roles.size > 1 ? member.roles.filter(r => r.position !== 0).sort((a, b) => b.position - a.position).map(r => `<@&${r.id}>`).join(', ') : "'None"}`, false)
            .send();
    }
};
