import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(\d+)/i;

export default class extends Command {
    aliases = ['vol'];
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage) {
        try {
            const connection =
                message.guild.voice && message.guild.voice.connection;

            if (!connection || !message.guild.guildStream.dispatcher)
                return message.send(
                    message.translate('common:NOTHING_STREAMING')
                );

            const args = regex.exec(message.content);

            const x = Math.round(
                args
                    ? message.guild.guildStream.dispatcher.volume
                    : connection.dispatcher.volume * 10
            );
            const response = `${'▰'.repeat(x > 10 ? x / 2 : x)} ${'▱'.repeat(
                x > 10 ? 10 - x / 2 : 10 - x
            )} ${Math.round(
                message.guild.guildStream.dispatcher.volume * 100
            )}`;

            if (!args)
                return message.reply(
                    message.translate('music/volume:CHANGED', {
                        amount: response
                    })
                );
            args.shift();

            const [number] = args;
            const volume = parseInt(number, 10);

            if (
                !(await this.client.utility.music.hasPermissions(
                    message,
                    message.guild.settings.music.volume
                ))
            )
                return;

            if (volume < 0 || volume > 200)
                return message.error(message.translate('music/volume:INVALID'));
            if (
                !message.member.voice.channel ||
                message.member.voice.channel.id !== connection.channel.id
            )
                return message.error(message.translate('common:WRONG_VOICE'));

            message.guild.guildStream.setVolume(volume * 0.01);

            return message.reply(
                message.translate('music/volume:CHANGED', { amount: response })
            );
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
}
