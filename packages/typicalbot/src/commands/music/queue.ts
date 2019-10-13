import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
            aliases = ['q'];
            mode = Constants.Modes.LITE;

    execute(message: TypicalGuildMessage) {
        try {
            const connection = message.guild.voice && message.guild.voice.connection;

            if (!connection || !message.guild.guildStream.current) return message.send(message.translate('common:NOTHING_STREAMING'));
            if (message.guild.guildStream.mode !== 'queue') return message.error(message.translate('common:NEED_QUEUE'));

            const { queue } = message.guild.guildStream;

            const CURRENT = message.translate('queue:CURRENT', { title: this.client.helpers.lengthen.shorten(message.guild.guildStream.current.title, 45), time: this.client.helpers.convertTime.execute(message, 1000 * parseInt(message.guild.guildStream.current.length, 10)), user: message.guild.guildStream.current.requester.author.username });

            if (!queue.length) return message.send([
                message.translate('queue:NONE'),
                '',
                '',
                CURRENT
            ].join('\n'));

            const list = queue.slice(0, 10);
            const content = list.map((s) => message.translate('queue:LIST', {
                title: this.client.helpers.lengthen.shorten(s.title, 45),
                time: this.client.helpers.convertTime.execute(message, 1000 * parseInt(s.length, 10)),
                user: s.requester.author.username
            })).join('\n');

            let length = 0;
            queue.forEach((s) => length += Number(s.length));

            return message.send([
                message.translate('queue:LEFT', { amount: queue.length, time: this.client.helpers.convertTime.execute(message, 1000 * length) }),
                '',
                content,
                queue.length > 10 ? message.translate('queue:MORE') : '',
                '',
                CURRENT
            ].join('\n'));
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
};
