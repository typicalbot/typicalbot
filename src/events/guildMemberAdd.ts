import Event from '../structures/Event';
import { TypicalGuildMember, TypicalGuild } from '../types/typicalbot';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class GuildMemberAdd extends Event {
    async execute(member: TypicalGuildMember) {
        if (!member.guild.available) return;

        const guild = member.guild as TypicalGuild;
        const { user } = member;

        const settings = await this.client.settings.fetch(guild.id);

        if (settings.logs.join !== '--disabled') {
            if (settings.logs.id && guild.channels.has(settings.logs.id)) {
                const channel = guild.channels.get(
                    settings.logs.id
                ) as TextChannel;
                if (channel.type !== 'text') return;

                if (settings.logs.join === '--embed') {
                    channel
                        .send(
                            new MessageEmbed()
                                .setColor(0x00ff00)
                                .setAuthor(
                                    `${user.tag} (${user.id})`,
                                    user.displayAvatarURL()
                                )
                                .setFooter(
                                    guild.translate('help/logs:USER_JOINED')
                                )
                                .setTimestamp()
                        )
                        .catch(() => null);
                } else {
                    channel
                        .send(
                            settings.logs.join
                                ? this.client.helpers.formatMessage.execute(
                                      'logs',
                                      guild,
                                      user,
                                      settings.logs.join
                                  )
                                : guild.translate('help/logs:JOINED_SERVER', {
                                      user: user.tag
                                  })
                        )
                        .catch(() => null);
                }
            }
        }

        if (settings.auto.message && !user.bot)
            user.send(
                [
                    guild.translate('help/logs:WELCOME_ALERT', {
                        name: guild.name
                    }),
                    '',
                    this.client.helpers.formatMessage.execute(
                        'automessage',
                        guild,
                        user,
                        settings.auto.message
                    )
                ].join('\n')
            ).catch(() => null);

        if (settings.auto.nickname)
            member
                .setNickname(
                    this.client.helpers.formatMessage.execute(
                        'autonick',
                        guild,
                        user,
                        settings.auto.nickname
                    )
                )
                .catch(() => null);

        const autorole =
            settings.auto.role.bots && member.user.bot
                ? guild.roles.get(settings.auto.role.bots)
                : settings.auto.role.id
                ? guild.roles.get(settings.auto.role.id)
                : null;
        if (!autorole || !autorole.editable) return;

        setTimeout(async () => {
            const added = await member.roles
                .add(autorole.id)
                .catch(() => console.log('Missing Permissions'));

            if (!settings.auto.role.silent) return null;

            if (!added || !settings.logs.id) return null;

            const channel = guild.channels.get(settings.logs.id) as TextChannel;
            if (!channel || channel.type !== 'text') return null;

            return channel.send(
                guild.translate('help/logs:AUTOROLE', {
                    user: user.tag,
                    role: autorole.name
                })
            );
        }, settings.auto.role.delay || 2000);
    }
}
