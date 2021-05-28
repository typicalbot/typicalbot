import * as Sentry from '@sentry/node';
import { TextChannel, MessageEmbed } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMember, TypicalGuild } from '../lib/types/typicalbot';
import { formatMessage } from '../lib/utils/util';

export default class GuildMemberRemove extends Event {
    async execute(member: TypicalGuildMember) {
        if (!member.guild.available) return;

        const guild = member.guild as TypicalGuild;
        // If bot has ban perms check if this was a ban and if so cancel out
        if (guild.me?.permissions.has('BAN_MEMBERS')) {
            const ban = await guild.bans.fetch(member.id).catch(() => null);
            if (ban) return;
        }


        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || settings.logs.leave === '--disabled') return;

        const { user } = member;

        const channel = guild.channels.cache.get(settings.logs.id) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.leave !== '--embed')
            return channel
                .send(settings.logs.leave
                    ? await formatMessage('logs', guild, user, settings.logs.leave)
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
