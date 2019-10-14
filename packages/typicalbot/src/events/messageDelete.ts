import Event from '../structures/Event';
import { TypicalGuild } from '../extensions/TypicalGuild';
import { TextChannel, MessageEmbed } from 'discord.js';
import { TypicalGuildMessage } from '../types/typicalbot';

export default class MessageDelete extends Event {
    async execute(message: TypicalGuildMessage) {
        if (
            message.partial ||
            message.channel.type !== 'text' ||
            !message.guild ||
            !message.guild.available
        )
            return;

        const settings = await this.client.settings.fetch(message.guild.id);

        if (!settings.logs.id || !settings.logs.delete) return;

        const channel = message.guild.channels.get(
            settings.logs.id
        ) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        const user = message.author;

        if (settings.logs.delete !== '--embed')
            return channel
                .send(
                    settings.logs.delete === '--enabled'
                        ? message.translate('logs:DELETED', { user: user.tag })
                        : this.client.helpers.formatMessage.execute(
                              'logs-msgdel',
                              message.guild as TypicalGuild,
                              user,
                              settings.logs.delete,
                              {
                                  message,
                                  channel: message.channel as TextChannel
                              }
                          )
                )
                .catch(() => null);

        return channel
            .send(
                new MessageEmbed()
                    .setColor(0x3ea7ed)
                    .setAuthor(
                        `${user.tag} (${user.id})`,
                        user.displayAvatarURL()
                    )
                    .setDescription(
                        this.client.helpers.lengthen.execute(
                            message.content,
                            100
                        )
                    )
                    .setFooter(
                        message.translate('logs:MESSAGE_DELETED', {
                            channel: message.channel.toString(),
                            id: message.channel.id
                        })
                    )
                    .setTimestamp()
            )
            .catch(() => null);
    }
}
