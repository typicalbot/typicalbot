import fs from 'fs';
import { MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE } from '../../lib/utils/constants';

const regex = /#?([0-9a-fA-F]{6}|random)/i;

export default class extends Command {
    mode = MODE.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        const [color] = args;
        const hex =
            color === 'random'
                ? Math.floor(Math.random() * 16777215).toString(16)
                : color;

        const json = await fetch(`https://canvas.typicalbot.com/api/v1/color?hex=${hex}`).then((body) => body.json());

        fs.writeFile('data/image.png', json.image.split(';base64,').pop(), { encoding: 'base64' }, (err) => {
            if (err) console.error(err);
        });

        return message.attachment(new MessageAttachment('data/image.png'));
    }
}
