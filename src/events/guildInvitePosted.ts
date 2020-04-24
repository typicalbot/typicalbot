import * as Sentry from '@sentry/node';
import { Collection } from 'discord.js';
import { MessageEmbed, TextChannel, User } from 'discord.js';
import Event from '../structures/Event';
import { TypicalGuildMessage } from '../types/typicalbot';
import Constants from '../utility/Constants';

export default class GuildInvitePosted extends Event {
    async execute(message: TypicalGuildMessage) {
        await message.delete();
        await message.error(message.translate('core/invite:PROHIBITED'));

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
                        .setAction(Constants.ModerationLogTypes.WARN)
                        .setModerator(this.client.user as User)
                        .setUser(message.author)
                        .setReason(message.translate('core/invite:REASON', {
                            action: message.translate('common:WARN'),
                            type:
                                    settings.automod.invitewarn === 1
                                        ? message.translate('core/invite:INVITE')
                                        : message.translate('core/invite:CONSECUTIVE', {
                                            amount: settings.automod.invitewarn
                                        }),
                            channel: message.channel.toString()
                        }))
                        .send();
                }
            } else if (
                settings.automod.invitekick !== 0 &&
                cache.size >= settings.automod.invitekick
            ) {
                const reason = message.translate('core/invite:REASON', {
                    action: message.translate('common:KICK'),
                    type:
                        settings.automod.invitekick === 1
                            ? message.translate('core/invite:INVITE')
                            : message.translate('core/invite:CONSECUTIVE', {
                                amount: cache.size
                            }),
                    channel: message.channel.toString()
                });
                await message.member.kick(reason);

                if (settings.logs.moderation) {
                    await this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLogTypes.KICK)
                        .setModerator(this.client.user as User)
                        .setUser(message.author)
                        .setReason(reason)
                        .send();
                }
            }
        }

        if (!settings.logs.id || !settings.logs.invite) return;

        const channel = message.guild.channels.cache.get(settings.logs.id) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.invite !== '--embed') {
            return channel.send(settings.logs.invite === '--enabled'
                ? message.translate('core/invite:SENT', {
                    user: message.author.tag,
                    channel: message.channel.toString()
                })
                : await this.client.helpers.formatMessage.execute('logs-invite', message.guild, message.author, settings.logs.invite, { channel: message.channel }));
        }

        return channel
            .send(new MessageEmbed()
                .setColor(0x00ff00)
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                .setFooter(message.translate('core/invite:SENT_IN', {
                    channel: message.channel.toString()
                }))
                .setTimestamp())
            .catch((err) => Sentry.captureException(err));
    }
}
