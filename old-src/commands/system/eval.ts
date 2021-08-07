import { inspect } from 'util';
import { MessageEmbed } from 'discord.js';
import { VM } from 'vm2';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL, LINK } from '../../lib/utils/constants';

const regex = /^(-(?:u|unsafe)\s+)?([\W\w]+)/;

export default class extends Command {
    permission = PERMISSION_LEVEL.BOT_OWNER;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const embed = new MessageEmbed()
            .setColor(0x00ff00)
            .setFooter('TypicalBot Eval', LINK.ICON);
        try {
            const args = regex.exec(parameters);
            if (!args) return;
            args.shift();

            const [unsafe, code] = args;
            const vm = new VM();
            const result = unsafe
                ? eval(`(async () => { ${code} })()`)
                : vm.run(`(async () => { ${code} })()`);

            if (result instanceof Promise) {
                result
                    .then((a) => {
                        message
                            .embed(embed.setDescription([
                                '',
                                '',
                                '```ts',
                                inspect(a, { depth: 0 }),
                                '```'
                            ].join('\n')))
                            .catch((err) => {
                                message.embed(embed.setDescription(['```', err.stack, '```'].join('\n')));
                            });
                    })
                    .catch((err) => {
                        message.embed(embed.setDescription([
                            '',
                            '',
                            '```',
                            err ? err.stack : 'Unknown Error',
                            '```'
                        ].join('\n')));
                    });

                return null;
            }

            if (result instanceof Object) {
                return message.embed(embed.setDescription(['```ts', inspect(result, { depth: 0 }), '```'].join('\n')));
            }

            return message.embed(embed.setDescription(['```', result, '```'].join('\n')));
        } catch (err) {
            return message
                .embed(embed
                    .setDescription(['```', err.stack, '```'].join('\n'))
                    .setColor(0xff0000))
                .catch(() => {
                    return message.reply('Cannot send embeds.');
                });
        }
    }
}
