import * as Sentry from '@sentry/node';
import { TextChannel, MessageEmbed } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMember, TypicalGuild } from '../lib/types/typicalbot';

export default class GuildMemberRemove extends Event {
    async execute(member: TypicalGuildMember) {
        if (!member.guild.available) return;

        const guild = member.guild as TypicalGuild;
        if (!guild.me?.permissions.has('BAN_MEMBERS')) return;

        const bans = await guild.fetchBans().catch(() => null);
        if (bans && bans.has(member.id)) return;

        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || settings.logs.leave === '--disabled') return;

        const { user } = member;

        const channel = guild.channels.cache.get(settings.logs.id) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.leave !== '--embed')
            return channel
                .send(settings.logs.leave
                    ? await this.client.helpers.formatMessage.execute('logs', guild, user, settings.logs.leave)
                    : guild.translate('help/logs:LEFT', { user: user.tag }))
                .catch((err) => Sentry.captureException(err));

        return channel
            .send(new MessageEmbed()
                .setColor(0xff6600)
                .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
                .setFooter(guild.translate('help/logs:USER_LEFT'))
                .setTimestamp())
            .catch((err) => Sentry.captureException(err));
    }
}
