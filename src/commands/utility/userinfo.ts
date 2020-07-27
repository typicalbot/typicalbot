import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';
import { resolveMember } from '../../lib/utils/util';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i;

export default class extends Command {
    aliases = ['uinfo', 'whois'];
    mode = Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) ?? [];
        args.shift();
        const [id, username, discriminator] = args;
        const member = await resolveMember(this.client, message, id, username, discriminator);
        if (!member) return message.translate('common:USER_NOT_FOUND');

        const user = member.user;

        const ROLES =
            member.roles.cache.size > 1
                ? member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map((role) => role.name)
                    .slice(0, -1)
                    .join(', ')
                : message.translate('common:NONE');

        if (!message.embeddable)
            return message.reply([
                `**__${user.tag}__**`,
                '```',
                message.translate('utility/userinfo:ID', { id: member.id }),
                message.translate('utility/userinfo:STATUS', {
                    status: member.user.presence.status
                }),
                message.translate('utility/userinfo:AVATAR', {
                    avatar: member.user.displayAvatarURL({
                        format: 'png',
                        size: 2048
                    })
                }),
                message.translate('utility/userinfo:JOINED', {
                    time: moment(member.joinedAt as Date).format('MMM DD, YYYY hh:mm A')
                }),
                message.translate('utility/userinfo:REGISTERED', {
                    time: moment(member.user.createdAt).format('')
                }),
                message.translate('utility/userinfo:ROLES', {
                    roles: ROLES
                }),
                '```'
            ].join('\n'));

        return message.send(new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setThumbnail(user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addFields([
                {
                    name: message.translate('common:ID_FIELD'),
                    value: user.id,
                    inline: true
                },
                {
                    name: message.translate('common:STATUS_FIELD'),
                    value: user.presence.status,
                    inline: true
                },
                {
                    name: message.translate('common:JOINED_FIELD'),
                    value: moment(member.joinedAt as Date).format('MMM DD, YYYY hh:mm A'),
                    inline: true
                },
                {
                    name: message.translate('common:REGISTERED_FIELD'),
                    value: moment(user.createdAt).format('MMM DD, YYYY hh:mm A'),
                    inline: true
                },
                {
                    name: message.translate('utility/userinfo:ROLE_FIELD', {
                        amount: member.roles.cache.size - 1
                    }),
                    value: ROLES
                }
            ]));
    }
}
