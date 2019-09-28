import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';

export default class extends Command {
    aliases = ['cmds'];
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: Message) {
        if (message.channel.type === 'text')
            message.reply(message.translate('commands:CHECK_DM'));

        const list = Array.from(this.client.commands.keys());

        const level4 = list
            .filter(c => this.client.commands.get(c).permission === 4)
            .map(c => `${this.client.config.prefix}${c}`);
        const level3 = list
            .filter(c => this.client.commands.get(c).permission === 3)
            .map(c => `${this.client.config.prefix}${c}`);
        const level2 = list
            .filter(c => this.client.commands.get(c).permission === 2)
            .map(c => `${this.client.config.prefix}${c}`);
        const level1 = list
            .filter(c => this.client.commands.get(c).permission === 1)
            .map(c => `${this.client.config.prefix}${c}`);
        const level0 = list
            .filter(c => this.client.commands.get(c).permission === 0)
            .map(c => `${this.client.config.prefix}${c}`);

        const NONE = message.translate('commands:NONE');

        // TODO: fix this if discord.js fixes partials behavior
        return (
            message.author &&
            message.author.send(
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
        );
    }
}
