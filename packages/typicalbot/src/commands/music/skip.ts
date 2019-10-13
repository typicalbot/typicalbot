import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(\d+)/i;

export default class extends Command {
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!await this.client.utility.music.hasPermissions(message, message.guild.settings.music.skip)) return;

        try {
            const connection = message.guild.voice && message.guild.voice.connection;
            if (!connection) return message.send(message.translate('common:NOTHING_STREAMING'));
            if (!message.member.voice.channel || message.member.voice.channel.id !== connection.channel.id) return message.error(message.translate('common:WRONG_VOICE'));
            if (message.guild.guildStream.mode !== 'queue') return message.error(message.translate('common:NEED_QUEUE'));

            const args = regex.exec(parameters) || [];
            args.shift();

            const [number] = args;
            const amount = parseInt(number, 10);

            if (amount) message.guild.guildStream.queue.splice(0, amount - 1);

            const song = message.guild.guildStream.skip();

            if (!song) return message.reply(message.translate('skip:SKIPPING'));

            return message.reply(message.translate(amount ? 'skip:DETAILS_MULTIPLE' : 'skip:DETAILS', {
                title: song.title,
                user: song.requester.author.username,
                amount: amount - 1
            }));
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
};
