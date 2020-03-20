import Event from '../structures/Event';
import Constants from '../utility/Constants';
import { TypicalGuild } from '../types/typicalbot';
import { User, TextChannel, MessageEmbed } from 'discord.js';
import * as Sentry from '@sentry/node';

export default class GuildBanAdd extends Event {
    async execute(guild: TypicalGuild, user: User) {
        if (!guild.available) return;

        const settings = await this.client.settings.fetch(guild.id);

        if (
            settings.logs.moderation &&
            !this.client.caches.softbans.has(user.id)
        ) {
            const cachedLog = this.client.caches.bans.get(user.id);

            const newCase = await guild.buildModerationLog();
            newCase.setAction(Constants.ModerationLogTypes.BAN).setUser(user);
            if (cachedLog) {
                newCase.setModerator(cachedLog.moderator);
                if (cachedLog.reason) newCase.setReason(cachedLog.reason);
                if (cachedLog.expiration)
                    newCase.setExpiration(cachedLog.expiration);
            }
            await newCase.send();

            this.client.caches.bans.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.ban === '--disabled') return;

        const channel = guild.channels.cache.get(
            settings.logs.id
        ) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (settings.logs.ban === '--embed')
            return channel
                .send(
                    new MessageEmbed()
                        .setColor(0xff0000)
                        .setAuthor(
                            `${user.tag} (${user.id})`,
                            user.displayAvatarURL()
                        )
                        .setFooter(
                            guild.translate('moderation/ban:USER_BANNED')
                        )
                        .setTimestamp()
                )
                .catch(() => null);

        return channel
            .send(
                settings.logs.ban
                    ? await this.client.helpers.formatMessage.execute(
                        'logs',
                        guild,
                        user,
                        settings.logs.ban
                    )
                    : `**${user.tag}** has been banned from the server.`
            )
            .catch((err) => Sentry.captureException(err));
    }
}
