const Command = require("../../structures/Command");
const { Canvas } = require("canvas-constructor");
const { Attachment } = require("discord.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "hex",
            description: "Sends a preview of a hex color.",
            usage: "hex <hex-color:0-9a-fA-F>",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /hex\s+#?([0-9a-fA-F]{6})/i.exec(message.content);
        if (!args) return response.usage(this);

        const hex = args[1];

        message.channel.send(
            new Attachment(
                new Canvas(200, 100)
                    .setColor(`#${hex}`)
                    .addRect(5, 5, 190, 90)
                    .setColor(`${this.bw(hex)}`)
                    .setTextFont('20px Impact')
                    .setTextAlign('right')
                    .addText(`#${hex}`.toUpperCase(), 100, 90)
                    .toBuffer()
                )
        );
    }

    bw(hexcolor) {
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);

        const value = ((r*299)+(g*587)+(b*114))/1000;

        return (value >= 128) ? '#000000' : '#ffffff';
    }
};
