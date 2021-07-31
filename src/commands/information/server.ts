import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, LINK } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['serverinfo', 'sinfo'];
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage) {
        const guildOwner = await this.client.users
            .fetch(message.guild.ownerID)
            .catch(() => null);
        const UNKNOWN = message.translate('common:USER_FETCH_ERROR');

        if (!message.embeddable)
            return message.reply([
                message.translate('information/server:SERVER', {
                    name: message.guild.name
                }),
                '```',
                message.translate('information/server:NAME', {
                    name: message.guild.name,
                    id: message.guild.id
                }),
                message.translate('information/server:OWNER', {
                    user: guildOwner ? guildOwner.tag : UNKNOWN,
                    id: message.guild.ownerID
                }),
                message.translate('information/server:CREATED', {
                    time: moment(message.guild.createdAt).format('dddd MMMM Do, YYYY, hh:mm A')
                }),
                message.translate('information/server:VERIFICATION', {
                    level: message.guild.verificationLevel
                }),
                message.translate('information/server:ICON', {
                    url:
                        message.guild.iconURL({
                            format: 'png',
                            size: 2048
                        }) ?? message.translate('common:NONE')
                }),
                message.translate('information/server:CHANNELS', {
                    amount: message.guild.channels.cache.size
                }),
                message.translate('information/server:MEMBERS', {
                    amount: message.guild.memberCount
                }),
                message.translate('information/server:ROLES', {
                    amount: message.guild.roles.cache.size
                }),
                message.translate('information/server:EMOJIS', {
                    amount: message.guild.emojis.cache.size
                }),
                message.translate('information/server:BOOSTED', {
                    level: message.guild.premiumTier,
                    amount: message.guild.premiumSubscriptionCount ?? 0
                }),
                '```'
            ].join('\n'));

        return message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('information/server:INFO'))
            .addFields([
                {
                    name: message.translate('common:NAME_FIELD'),
                    value: message.guild.name,
                    inline: true
                },
                {
                    name: message.translate('common:ID_FIELD'),
                    value: message.guild.id,
                    inline: true
                },
                {
                    name: message.translate('common:OWNER_FIELD'),
                    value: `${guildOwner ? guildOwner.tag : UNKNOWN}\n${
                        message.guild.ownerID
                    }`,
                    inline: true
                },
                {
                    name: message.translate('common:CREATED_FIELD'),
                    value: `${moment(message.guild.createdAt)
                        .format('dddd MMMM Do, YYYY')}\n${moment(message.guild.createdAt).format('hh:mm A')}`,
                    inline: true
                },
                {
                    name: message.translate('common:VERIFICATION_FIELD'),
                    value: `${message.guild.verificationLevel}`,
                    inline: true
                },
                {
                    name: message.translate('common:CHANNELS_FIELD'),
                    value: `${message.guild.channels.cache.size}`,
                    inline: true
                },
                {
                    name: message.translate('common:MEMBERS_FIELD'),
                    value: `${message.guild.memberCount}`,
                    inline: true
                },
                {
                    name: message.translate('common:ROLES_FIELD'),
                    value: `${message.guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: message.translate('common:EMOJIS_FIELD'),
                    value: `${message.guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: message.translate('common:BOOSTED_FIELD'),
                    value: message.translate('information/server:BOOSTERS', {
                        level: message.guild.premiumTier,
                        amount:
                            message.guild.premiumSubscriptionCount ?? 0
                    })
                }
            ])
            .setThumbnail(message.guild.iconURL({ format: 'png', size: 2048 }) ?? '')
            .setFooter('TypicalBot', LINK.ICON));
    }
}
