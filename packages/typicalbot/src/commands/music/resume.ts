import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['unpause'];
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage) {
        if (
            !(await this.client.utility.music.hasPermissions(
                message,
                message.guild.settings.music.resume
            ))
        )
            return;

        try {
            const connection =
                message.guild.voice && message.guild.voice.connection;
            if (!connection)
                return message.send(
                    message.translate('common:NOTHING_STREAMING')
                );

            if (
                !message.member.voice.channel ||
                message.member.voice.channel.id !== connection.channel.id
            )
                return message.error(message.translate('common:WRONG_VOICE'));

            if (message.guild.guildStream.mode !== 'queue')
                return message.error(message.translate('common:NEED_QUEUE'));

            message.guild.guildStream.resume();

            return message.reply(message.translate('resume:RESUMING'));
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
}
