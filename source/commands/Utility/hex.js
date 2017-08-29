const Command = require("../../structures/Command");
const Canvas = require("canvas-constructor");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "hex",
            description: "Sends a preview of a hex color.",
            usage: "search <query>",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /hex\s+#?([\w\d]{6})/i.exec(message.content);
        if (!args) return response.usage(this);

        const hex = args[1];

        message.channel.send({
            attachment: new Canvas(300, 300)
                .setColor(`#${hex}`)
                .addRect(5, 5, 290, 290)
                .setColor(`#000000`)
                .setTextFont('28px Impact')
                .setTextAlign('center')
                .addText(`#${hex}`.toUpperCase(), 150, 150)
                .toBuffer()
        });
    }
};
