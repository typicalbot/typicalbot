import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['cmds'];
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalMessage) {
        if (message.channel.type === 'text')
            message.respond(message.translate('core/commands:CHECK_DM'));

        const level0 = [];
        const level2 = [];
        const level3 = [];
        const level4 = [];

        for (const [name, command] of this.client.commands.entries()) {
            const commandName = `${this.client.config.prefix}${name}`;

            switch (command.permission) {
                case 0:
                    level0.push(commandName);
                    break;
                case 2:
                    level2.push(commandName);
                    break;
                case 3:
                    level3.push(commandName);
                    break;
                case 4:
                    level4.push(commandName);
                    break;
            }
        }

        const NONE = message.translate('core/commands:NONE');

        return message.author
            .send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle('TypicalBot Commands')
                    .setDescription(
                        message.translate('core/commands:TEXT', {
                            prefix: this.client.config.prefix
                        })
                    )
                    .addFields([
                        {
                            name: message.translate('core/commands:OWNER'),
                            value: level4.length ? level4.join(', ') : NONE
                        },
                        {
                            name: message.translate('core/commands:ADMIN'),
                            value: level3.length ? level3.join(', ') : NONE
                        },
                        {
                            name: message.translate('core/commands:MOD'),
                            value: level2.length ? level2.join(', ') : NONE
                        },
                        {
                            name: message.translate('core/commands:MEMBER'),
                            value: level0.length ? level0.join(', ') : NONE
                        }
                    ])
                    .setFooter('TypicalBot', Constants.Links.ICON)
                    .setTimestamp()
            )
            .catch(() => null);
    }
}
