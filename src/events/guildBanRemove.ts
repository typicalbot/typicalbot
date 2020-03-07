import Event from '../structures/Event';
import Constants from '../utility/Constants';
import { TypicalGuild } from '../types/typicalbot';
import { MessageEmbed, User, TextChannel } from 'discord.js';
import * as Sentry from '@sentry/node';

export default class GuildBanRemove extends Event {
    async execute(guild: TypicalGuild, user: User) {
        if (!guild.available) return;

        const settings = await this.client.settings.fetch(guild.id);

        if (
            settings.logs.moderation &&
            !this.client.caches.softbans.has(user.id)
        ) {
            const cachedLog = this.client.caches.unbans.get(user.id);

            const newCase = await guild.buildModerationLog();
            newCase.setAction(Constants.ModerationLogTypes.UNBAN).setUser(user);
            if (cachedLog) {
                newCase.setModerator(cachedLog.moderator);
                if (cachedLog.reason) newCase.setReason(cachedLog.reason);
            }
            newCase.send();

            this.client.caches.unbans.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.unban === '--disabled') return;

        const channel = guild.channels.cache.get(
            settings.logs.id
        ) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.unban !== '--embed') {
            channel
                .send(
                    settings.logs.unban
                        ? await this.client.helpers.formatMessage.execute(
                            'logs',
                            guild,
                            user,
                            settings.logs.unban
                        )
                        : guild.translate('moderation/unban:USER_UNBAN', {
                            user: user.tag
                        })
                )
                .catch(() => null);
        }

        return channel
            .send(
                new MessageEmbed()
                    .setColor(0x3ea7ed)
                    .setAuthor(
                        `${user.tag} (${user.id})`,
                        user.displayAvatarURL()
                    )
                    .setFooter(
                        guild.translate('moderation/unban:USER_UNBANNED')
                    )
                    .setTimestamp()
            )
            .catch(err => Sentry.captureException(err));
    }
}
