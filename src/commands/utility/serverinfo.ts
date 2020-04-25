import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import Command from '../../lib/structures/Command';
import { Modes, Links } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['sinfo'];
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        const guildOwner = await this.client.users
            .fetch(message.guild.ownerID)
            .catch(() => null);
        const UNKNOWN = message.translate('common:USER_FETCH_ERROR');

        if (!message.embeddable)
            return message.reply([
                message.translate('utility/serverinfo:SERVER', {
                    name: message.guild.name
                }),
                '```',
                message.translate('utility/serverinfo:NAME', {
                    name: message.guild.name,
                    id: message.guild.id
                }),
                message.translate('utility/serverinfo:OWNER', {
                    user: guildOwner ? guildOwner.tag : UNKNOWN,
                    id: message.guild.ownerID
                }),
                message.translate('utility/serverinfo:CREATED', {
                    time: moment(message.guild.createdAt).format('dddd MMMM Do, YYYY, hh:mm A')
                }),
                message.translate('utility/serverinfo:REGION', {
                    region: message.guild.region
                }),
                message.translate('utility/serverinfo:VERIFICATION', {
                    level: message.guild.verificationLevel
                }),
                message.translate('utility/serverinfo:ICON', {
                    url:
                            message.guild.iconURL({
                                format: 'png',
                                size: 2048
                            }) || message.translate('common:NONE')
                }),
                message.translate('utility/serverinfo:CHANNELS', {
                    amount: message.guild.channels.cache.size
                }),
                message.translate('utility/serverinfo:MEMBERS', {
                    amount: message.guild.memberCount
                }),
                message.translate('utility/serverinfo:ROLES', {
                    amount: message.guild.roles.cache.size
                }),
                message.translate('utility/serverinfo:EMOJIS', {
                    amount: message.guild.emojis.cache.size
                }),
                message.translate('utility/serverinfo:BOOSTED', {
                    level: message.guild.premiumTier,
                    amount: message.guild.premiumSubscriptionCount || 0
                }),
                '```'
            ].join('\n'));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('utility/serverinfo:INFO'))
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
                    value: `${moment(message.guild.createdAt).format('dddd MMMM Do, YYYY')}\n${moment(message.guild.createdAt).format('hh:mm A')}`,
                    inline: true
                },
                {
                    name: message.translate('common:REGION_FIELD'),
                    value: message.guild.region.toUpperCase(),
                    inline: true
                },
                {
                    name: message.translate('common:VERIFICATION_FIELD'),
                    value: message.guild.verificationLevel,
                    inline: true
                },
                {
                    name: message.translate('common:CHANNELS_FIELD'),
                    value: message.guild.channels.cache.size,
                    inline: true
                },
                {
                    name: message.translate('common:MEMBERS_FIELD'),
                    value: message.guild.memberCount,
                    inline: true
                },
                {
                    name: message.translate('common:ROLES_FIELD'),
                    value: message.guild.roles.cache.size,
                    inline: true
                },
                {
                    name: message.translate('common:EMOJIS_FIELD'),
                    value: message.guild.emojis.cache.size,
                    inline: true
                },
                {
                    name: message.translate('common:BOOSTED_FIELD'),
                    value: message.translate('utility/serverinfo:BOOSTERS', {
                        level: message.guild.premiumTier,
                        amount:
                                    message.guild.premiumSubscriptionCount || 0
                    })
                }
            ])
            .setThumbnail(message.guild.iconURL({ format: 'png', size: 2048 }) || '')
            .setFooter('TypicalBot', Links.ICON));
    }
}
