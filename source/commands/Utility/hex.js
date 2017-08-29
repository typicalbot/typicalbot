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
                    .setColor(`#ffffff`)
                    .setTextFont('20px Impact')
                    .setTextAlign('right')
                    .addText(`#${hex}`.toUpperCase(), 100, 90)
                    .toBuffer()
                )
        );
    }
};