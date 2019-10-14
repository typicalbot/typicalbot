import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(.+)/i;
const indexRegex = /^\d+$/;

export default class extends Command {
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        if (
            !(await this.client.utility.music.hasPermissions(
                message,
                message.guild.settings.music.unqueue
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
            if (message.guild.guildStream.mode !== 'queue')
                return message.error(message.translate('common:NEED_QUEUE'));

            const args = regex.exec(parameters);
            if (!args)
                return message.error(
                    message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: this.client.config.prefix
                    })
                );
            args.shift();

            const { queue } = message.guild.guildStream;
            const [query] = args;

            const results = queue.filter(v =>
                v.title.toLowerCase().includes(query.toLowerCase())
            );

            if (!results.length)
                return message.error(
                    message.translate('unqueue:NONE', { query })
                );

            if (results.length < 1) {
                const index = queue.findIndex(
                    video => video.title === results[0].title
                );
                queue.splice(index, 1);

                return message.reply(
                    `Removed **${results[0].title}** from the queue.`
                );
            }

            const videos = results
                .map((v, i) => `**${i + 1}:** ${v.title}`)
                .join('\n');

            message.send(
                [message.translate('unqueue:FOUND_MULTIPLE'), '', videos].join(
                    '\n'
                )
            );

            const messages = await message.channel
                .awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })
                .catch(() => null);

            if (!messages || !messages.size)
                return message.error(message.translate('common:NO_RESPONSE'));

            const first = messages.first() as TypicalGuildMessage;

            if (first.content === 'cancel')
                return message.reply(message.translate('common:CANCELLED'));

            if (first.content === 'all') {
                results.forEach(v => {
                    queue.splice(queue.indexOf(v), 1);
                });

                return message.reply(
                    message.translate('unqueue:ALL', { amount: results.length })
                );
            }
            if (indexRegex.test(first.content)) {
                queue.splice(
                    queue.indexOf(results[parseInt(first.content, 10) - 1]),
                    1
                );

                return message.reply(
                    message.translate('unqueue:ONE', {
                        title: results[0].title
                    })
                );
            }

            return message.error(message.translate('unqueue:INVALID'));
        } catch (e) {
            return message.send(message.translate('common:NOTHING_STREAMING'));
        }
    }
}
