import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['np', 'song'];
    mode = Constants.Modes.LITE;

    execute(message: TypicalGuildMessage) {
        try {
            const connection =
                message.guild.voice && message.guild.voice.connection;
            if (
                !connection ||
                !message.guild.guildStream.dispatcher ||
                !message.guild.guildStream.current
            )
                return message.send(
                    message.translate('common:NOTHING_STREAMING')
                );

            const remaining =
                message.guild.guildStream.mode === 'queue'
                    ? parseInt(message.guild.guildStream.current.length, 10) *
                          1000 -
                      message.guild.guildStream.dispatcher.streamTime
                    : null;

            return message.send(
                message.translate('current:CURRENT', {
                    title: this.client.helpers.lengthen.shorten(
                        message.guild.guildStream.current.title,
                        45
                    ),
                    remaining: remaining
                        ? message.translate('current:REMAINING', {
                              amount: this.client.helpers.convertTime.execute(
                                  message,
                                  remaining
                              )
                          })
                        : '',
                    requester:
                        message.guild.guildStream.current.requester.author.username
                })
            );
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
}
