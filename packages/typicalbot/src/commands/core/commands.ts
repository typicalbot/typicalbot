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
            message.respond(message.translate('commands:CHECK_DM'));

        const level0 = [];
        const level1 = [];
        const level2 = [];
        const level3 = [];
        const level4 = [];

        for (const [name, command] of this.client.commands.entries()) {
            const commandName = `${this.client.config.prefix}${name}`;

            switch (command.permission) {
                case 0:
                    level0.push(commandName);
                    break;
                case 1:
                    level1.push(commandName);
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

        const NONE = message.translate('commands:NONE');

        // TODO: fix this if discord.js fixes partials behavior
        if (!message.author) return;
        return message.author
            .send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle('TypicalBot Commands')
                    .setDescription(
                        message.translate('commands:TEXT', {
                            prefix: this.client.config.prefix
                        })
                    )
                    .addField(
                        message.translate('commands:OWNER'),
                        level4.length ? level4.join(', ') : NONE
                    )
                    .addField(
                        message.translate('commands:ADMIN'),
                        level3.length ? level3.join(', ') : NONE
                    )
                    .addField(
                        message.translate('commands:MOD'),
                        level2.length ? level2.join(', ') : NONE
                    )
                    .addField(
                        message.translate('commands:DJ'),
                        level1.length ? level1.join(', ') : NONE
                    )
                    .addField(
                        message.translate('commands:MEMBER'),
                        level0.length ? level0.join(', ') : NONE
                    )
                    .setFooter('TypicalBot', Constants.Links.ICON)
                    .setTimestamp()
            )
            .catch(() => null);
    }
}
