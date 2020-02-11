import Event from '../structures/Event';
import { TypicalGuildMember } from '../extensions/TypicalGuildMember';
import { TypicalGuild } from '../extensions/TypicalGuild';
import { TextChannel, MessageEmbed } from 'discord.js';

export default class GuildMemberUpdate extends Event {
    async execute(oldMember: TypicalGuildMember, member: TypicalGuildMember) {
        if (!oldMember.guild.available) return;

        const guild = member.guild as TypicalGuild;

        const oldNickname = oldMember.nickname;
        const { nickname } = member;
        if (oldNickname === nickname) return;

        const settings = await this.client.settings.fetch(guild.id);
        if (!settings.logs.id || !settings.logs.nickname) return;

        const { user } = member;

        const channel = guild.channels.cache.get(
            settings.logs.id
        ) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        if (
            settings.auto.nickname &&
            nickname ===
                this.client.helpers.formatMessage.execute(
                    'autonick',
                    guild,
                    user,
                    settings.auto.nickname
                )
        )
            return;

        if (settings.logs.nickname !== '--embed')
            return channel
                .send(
                    settings.logs.nickname !== '--enabled'
                        ? this.client.helpers.formatMessage.execute(
                              'logs-nick',
                              guild,
                              user,
                              settings.logs.nickname,
                              { oldMember }
                          )
                        : guild.translate('help/logs:NICKNAMED', {
                              user: user.tag,
                              nickname: member.displayName
                          })
                )
                .catch(() => null);

        return channel
            .send(
                new MessageEmbed()
                    .setColor(0x00ff00)
                    .setAuthor(
                        `${user.tag} (${user.id})`,
                        user.displayAvatarURL()
                    )
                    .setFooter(
                        guild.translate('help/logs:CHANGED_NICK', {
                            nickname: member.displayName
                        })
                    )
                    .setTimestamp()
            )
            .catch(() => null);
    }
}
