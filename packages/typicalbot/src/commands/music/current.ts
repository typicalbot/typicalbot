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
                !connection.guildStream.dispatcher ||
                !connection.guildStream.current
            )
                return message.send(
                    message.translate('common:NOTHING_STREAMING')
                );

            const remaining =
                connection.guildStream.mode === 'queue'
                    ? parseInt(connection.guildStream.current.length, 10) *
                          1000 -
                      connection.guildStream.dispatcher.streamTime
                    : null;

            return message.send(
                message.translate('current:CURRENT', {
                    title: this.client.helpers.lengthen.shorten(
                        connection.guildStream.current.title,
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
                        connection.guildStream.current.requester.author.username
                })
            );
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
}
