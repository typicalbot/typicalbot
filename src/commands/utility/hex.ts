import { Canvas } from 'canvas-constructor';
import { MessageAttachment, MessageEmbed } from 'discord.js';
import { Modes } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /#?([0-9a-fA-F]{6}|random)/i;

export default class extends Command {
    mode = Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));
        args.shift();

        const [color] = args;
        const hex =
            color === 'random'
                ? Math.floor(Math.random() * 16777215).toString(16)
                : color;

        const buffer = new Canvas(200, 100)
            .setColor(`#${hex}`)
            .addRect(0, 0, 200, 100)
            .setColor(this.bw(hex))
            .setTextFont('20px Impact')
            .setTextAlign('left')
            .addText(`#${hex}`.toUpperCase(), 5, 95)
            .toBuffer();

        if (!message.embeddable)
            return message.channel.send(new MessageAttachment(buffer));

        return message.send(new MessageEmbed()
            .attachFiles([
                {
                    attachment: buffer,
                    name: 'color.png'
                }
            ])
            .setColor(parseInt(hex, 16))
            .setImage('attachment://color.png')
            .setFooter(`#${hex}`));
    }

    bw(hexcolor: string) {
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);

        const value = (r * 299 + g * 587 + b * 114) / 1000;

        return value >= 128 ? '#000000' : '#ffffff';
    }
}
