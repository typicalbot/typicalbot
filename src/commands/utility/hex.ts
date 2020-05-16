import fs from 'fs';
import { MessageAttachment, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

const regex = /#?([0-9a-fA-F]{6}|random)/i;

export default class extends Command {
    mode = Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
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

        const json = await fetch(`https://canvas.typicalbot.com/api/v1/color?hex=${hex}`).then((body) => body.json());

        fs.writeFile('image.png', json.image.split(';base64,').pop(), { encoding: 'base64' }, (err) => {
            if (err) console.error(err);
        });

        if (!message.embeddable)
            return message.channel.send(new MessageAttachment('image.png'));

        return message.send(new MessageEmbed()
            .attachFiles([
                {
                    attachment: 'image.png',
                    name: 'color.png'
                }
            ])
            .setColor(parseInt(hex, 16))
            .setImage('attachment://color.png')
            .setFooter(`#${hex}`));
    }
}
