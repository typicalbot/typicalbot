import * as Sentry from '@sentry/node';
import { Collection } from 'discord.js';
import { MessageEmbed, TextChannel, User } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage } from '../lib/types/typicalbot';
import { MODERATION_LOG_TYPE } from '../lib/utils/constants';
import { formatMessage } from '../lib/utils/util';

export default class GuildInvitePosted extends Event {
    async execute(message: TypicalGuildMessage) {
        if (message.deletable) message.delete().catch(() => undefined);
        message.error(message.translate('general/invite:PROHIBITED')).then((msg) => msg.delete());

        const { settings } = message.guild;

        if (
            settings.automod.inviteaction &&
            (settings.automod.invitewarn || settings.automod.invitekick)
        ) {
            const uniqueMemberID = `${message.guild.id}-${message.author.id}`;
            if (!this.client.caches.invites.has(uniqueMemberID))
                this.client.caches.invites.set(uniqueMemberID, new Collection());

            const cache = this.client.caches.invites.get(uniqueMemberID) as Collection<string, NodeJS.Timeout>;

            cache.set(message.id, setTimeout(() => cache.delete(message.id), 60000));

            if (
                settings.automod.invitewarn !== 0 &&
                cache.size === settings.automod.invitewarn
            ) {
                if (settings.logs.moderation) {
                    await this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(MODERATION_LOG_TYPE.WARN)
                        .setModerator(this.client.user as User)
                        .setUser(message.author)
                        .setReason(message.translate('general/invite:REASON', {
                            action: message.translate('common:WARN'),
                            type:
                                settings.automod.invitewarn === 1
                                    ? message.translate('general/invite:INVITE')
                                    : message.translate('general/invite:CONSECUTIVE', {
                                        amount: settings.automod.invitewarn
                                    }),
                            channel: `<#${message.channel.id}>`
                        }))
                        .send();
                }
            } else if (
                settings.automod.invitekick !== 0 &&
                cache.size >= settings.automod.invitekick
            ) {
                const reason = message.translate('general/invite:REASON', {
                    action: message.translate('common:KICK'),
                    type:
                        settings.automod.invitekick === 1
                            ? message.translate('general/invite:INVITE')
                            : message.translate('general/invite:CONSECUTIVE', {
                                amount: cache.size
                            }),
                    channel: `<#${message.channel.id}>`
                });
                message.member.kick(reason);

                if (settings.logs.moderation) {
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(MODERATION_LOG_TYPE.KICK)
                        .setModerator(this.client.user as User)
                        .setUser(message.author)
                        .setReason(reason)
                        .send();
                }
            }
        }

        if (!settings.logs.id || !settings.logs.invite) return;

        const channel = message.guild.channels.cache.get(`${BigInt(settings.logs.id)}`) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.invite !== '--embed') {
            return channel.send(settings.logs.invite === '--enabled'
                ? message.translate('general/invite:SENT', {
                    user: message.author.tag,
                    channel: `<#${message.channel.id}>`
                })
                // eslint-disable-next-line max-len
                : await formatMessage('logs-invite', message.guild, message.author, settings.logs.invite, { channel: message.channel }));
        }

        return channel
            .send(new MessageEmbed()
                .setColor(0x00ff00)
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                .setFooter(message.translate('general/invite:SENT_IN', {
                    channel: `<#${message.channel.id}>`
                }))
                .setTimestamp())
            .catch((err) => Sentry.captureException(err));
    }
}
