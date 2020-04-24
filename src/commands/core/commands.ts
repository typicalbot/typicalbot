import { MessageEmbed } from 'discord.js';
import { Modes, Links } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['cmds'];
    dm = true;
    mode = Modes.STRICT;

    async execute(message: TypicalMessage) {
        const dm = message.guild ? !message.embeddable || message.guild.settings.dm.commands : true;

        if (message.channel.type === 'text' && dm)
            await message.respond(message.translate('core/commands:CHECK_DM'));

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

        const channel = dm ? message.author : message.channel;

        return channel
            .send(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle('TypicalBot Commands')
                .setDescription(message.translate('core/commands:TEXT', {
                    prefix: this.client.config.prefix
                }))
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
                .setFooter('TypicalBot', Links.ICON)
                .setTimestamp())
            .catch(() => null);
    }
}
