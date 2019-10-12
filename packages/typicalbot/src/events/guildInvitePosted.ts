import { Collection } from 'discord.js';
import Event from '../structures/Event';
import Constants from '../utility/Constants';
import { TypicalGuildMessage } from '../types/typicalbot';
import { MessageEmbed, TextChannel, User } from 'discord.js';

export default class GuildInvitePosted extends Event {
    async execute(message: TypicalGuildMessage) {
        await message.delete();
        message.error(message.translate('invite:PROHIBITED'));

        const { settings } = message.guild;

        if (
            settings.automod.inviteaction &&
            (settings.automod.invitewarn || settings.automod.invitekick)
        ) {
            const uniqueMemberID = `${message.guild.id}-${message.author.id}`;
            if (!this.client.caches.invites.has(uniqueMemberID))
                this.client.caches.invites.set(
                    uniqueMemberID,
                    new Collection()
                );

            const cache = this.client.caches.invites.get(
                uniqueMemberID
            ) as Collection<string, NodeJS.Timeout>;

            cache.set(
                message.id,
                setTimeout(() => cache.delete(message.id), 60000)
            );

            if (
                settings.automod.invitewarn !== 0 &&
                cache.size === settings.automod.invitewarn
            ) {
                if (settings.logs.moderation) {
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLogTypes.WARN)
                        .setModerator(this.client.user as User)
                        .setUser(message.author)
                        .setReason(
                            message.translate('invite:REASON', {
                                action: message.translate('common:WARN'),
                                type:
                                    settings.automod.invitewarn === 1
                                        ? message.translate('invite:INVITE')
                                        : message.translate(
                                              'invite:CONSECUTIVE',
                                              {
                                                  amount:
                                                      settings.automod
                                                          .invitewarn
                                              }
                                          ),
                                channel: message.channel.toString()
                            })
                        )
                        .send();
                }
            } else if (
                settings.automod.invitekick !== 0 &&
                cache.size >= settings.automod.invitekick
            ) {
                const reason = message.translate('invite:REASON', {
                    action: message.translate('common:KICK'),
                    type:
                        settings.automod.invitekick === 1
                            ? message.translate('invite:INVITE')
                            : message.translate('invite:CONSECUTIVE', {
                                  amount: settings.automod.invitewarn
                              }),
                    channel: message.channel.toString()
                });
                message.member.kick(reason);

                if (settings.logs.moderation) {
                    this.client.handlers.moderationLog
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

        const channel = message.guild.channels.get(
            settings.logs.id
        ) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.invite !== '--embed') {
            return channel.send(
                settings.logs.invite === '--enabled'
                    ? message.translate('invite:SENT', {
                          user: message.author.tag,
                          channel: message.channel.toString()
                      })
                    : this.client.helpers.formatMessage.execute(
                          'logs-invite',
                          message.guild,
                          message.author,
                          settings.logs.invite,
                          { channel: message.channel }
                      )
            );
        }

        return channel
            .send(
                new MessageEmbed()
                    .setColor(0x00ff00)
                    .setAuthor(
                        `${message.author.tag} (${message.author.id})`,
                        message.author.displayAvatarURL()
                    )
                    .setFooter(
                        message.translate('invite:SENT_IN', {
                            channel: message.channel.toString()
                        })
                    )
                    .setTimestamp()
            )
            .catch(() => null);
    }
}
