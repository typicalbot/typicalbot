import * as Sentry from '@sentry/node';
import { MessageEmbed, TextChannel } from 'discord.js';
import Event from '../structures/Event';
import { TypicalGuildMember, TypicalGuild } from '../types/typicalbot';

export default class GuildMemberAdd extends Event {
    async execute(member: TypicalGuildMember) {
        if (!member.guild.available) return;

        const guild = member.guild as TypicalGuild;
        const { user } = member;

        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.join !== '--disabled') {
            if (
                settings.logs.id &&
                guild.channels.cache.has(settings.logs.id)
            ) {
                const channel = guild.channels.cache.get(settings.logs.id) as TextChannel;
                if (channel.type !== 'text') return;

                if (settings.logs.join === '--embed') {
                    channel
                        .send(new MessageEmbed()
                            .setColor(0x00ff00)
                            .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
                            .setFooter(guild.translate('help/logs:USER_JOINED'))
                            .setTimestamp())
                        .catch(() => null);
                } else {
                    channel
                        .send(settings.logs.join
                            ? await this.client.helpers.formatMessage.execute('logs', guild, user, settings.logs.join)
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
                await this.client.helpers.formatMessage.execute('automessage', guild, user, settings.auto.message)
            ].join('\n')).catch((err) => Sentry.captureException(err));

        if (settings.auto.nickname)
            member
                .setNickname(await this.client.helpers.formatMessage.execute('autonick', guild, user, settings.auto.nickname))
                .catch((err) => Sentry.captureException(err));

        const autorole =
            settings.auto.role.bots && member.user.bot
                ? guild.roles.cache.get(settings.auto.role.bots)
                : settings.auto.role.id
                    ? guild.roles.cache.get(settings.auto.role.id)
                    : null;
        if (!autorole || !autorole.editable) return;

        setTimeout(async () => {
            const added = await member.roles
                .add(autorole.id)
                .catch((err) => Sentry.captureException(err));

            if (settings.auto.role.silent) return null;

            if (!added || !settings.logs.id) return null;

            const channel = guild.channels.cache.get(settings.logs.id) as TextChannel;
            if (!channel || channel.type !== 'text') return null;

            return channel.send(guild.translate('help/logs:AUTOROLE', {
                user: user.tag,
                role: autorole.name
            }));
        }, settings.auto.role.delay || 2000);
    }
}
