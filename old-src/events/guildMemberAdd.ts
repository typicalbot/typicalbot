import * as Sentry from '@sentry/node';
import { MessageEmbed, TextChannel } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMember, TypicalGuild } from '../lib/types/typicalbot';
import { convertTime } from '../lib/utils/util';
import { formatMessage } from '../lib/utils/util';

export default class GuildMemberAdd extends Event {
    async execute(member: TypicalGuildMember) {
        if (!member.guild.available) return;

        const guild = member.guild as TypicalGuild;
        const { user } = member;

        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.join !== '--disabled') {
            if (
                settings.logs.id &&
                guild.channels.cache.has(`${BigInt(settings.logs.id)}`)
            ) {
                const channel = guild.channels.cache.get(`${BigInt(settings.logs.id)}`) as TextChannel;
                if (channel.type !== 'text') return;

                if (settings.logs.join === '--embed') {
                    const age = Date.now() - member.user.createdTimestamp;
                    const ACCOUNT_AGE = `${guild.translate('help/logs:USER_AGE', {
                        age: convertTime(guild, age, true)
                    })} ${age < 60000 * 15 ? guild.translate('help/logs:NEW_ACCOUNT') : ''}`;
                    channel
                        .send({ embeds: [new MessageEmbed()
                            .setColor(0x00ff00)
                            .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
                            .setDescription(ACCOUNT_AGE)
                            .setFooter(guild.translate('help/logs:USER_JOINED'))
                            .setTimestamp()] })
                        .catch(() => null);
                } else {
                    channel
                        .send(settings.logs.join
                            ? await formatMessage('logs', guild, user, settings.logs.join)
                            : guild.translate('help/logs:JOINED_SERVER', {
                                user: user.tag
                            }))
                        .catch((err) => Sentry.captureException(err));
                }
            }
        }

        if (settings.auto.message && !user.bot)
            user.send([
                guild.translate('help/logs:WELCOME_ALERT', {
                    name: guild.name
                }),
                '',
                await formatMessage('automessage', guild, user, settings.auto.message)
            ].join('\n')).catch((err) => Sentry.captureException(err));

        if (settings.auto.nickname)
            member
                // eslint-disable-next-line max-len
                .setNickname(await formatMessage('autonick', guild, user, settings.auto.nickname))
                .catch((err) => Sentry.captureException(err));

        this.client.handlers.moderationLog.processAutoRoles();
    }
}
