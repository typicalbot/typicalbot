const { Canvas } = require('canvas-constructor');
const { MessageAttachment } = require('discord.js');
const Constants = require('../../utility/Constants');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sends a preview of a hex color.',
            usage: 'hex <hex-color:0-9a-fA-F>',
            mode: Constants.Modes.LITE,
        });
    }

    execute(message, parameters) {
        const args = /#?([0-9a-fA-F]{6}|random)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const hex = args[1] === 'random' ? Math.floor(Math.random() * 16777215).toString(16) : args[1];

        message.channel.send(
            new MessageAttachment(
                new Canvas(200, 100)
                    .setColor(`#${hex}`)
                    .addRect(0, 0, 200, 100)
                    .setColor(`${this.bw(hex)}`)
                    .setTextFont('20px Impact')
                    .setTextAlign('left')
                    .addText(`#${hex}`.toUpperCase(), 5, 95)
                    .toBuffer(),
            ),
        );
    }

    embedExecute(message, parameters) {
        const args = /#?([0-9a-fA-F]{6}|random)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const hex = args[1] === 'random' ? Math.floor(Math.random() * 16777215).toString(16) : args[1];

        message.channel.buildEmbed()
            .attachFiles([{
                attachment:
                    new Canvas(200, 100)
                        .setColor(`#${hex}`)
                        .addRect(0, 0, 200, 100)
                        .setColor(`${this.bw(hex)}`)
                        .setTextFont('20px Impact')
                        .setTextAlign('left')
                        .addText(`#${hex}`.toUpperCase(), 5, 95)
                        .toBuffer(),
                name: 'color.png',
            }])
            .setColor(parseInt(hex, 16))
            .setImage('attachment://color.png')
            .setFooter(`#${hex}`)
            .send();
    }

    bw(hexcolor) {
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);

        const value = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (value >= 128) ? '#000000' : '#ffffff';
    }
};
