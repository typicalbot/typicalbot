const Command = require("../../structures/Command");
const canvas = require("canvas-constructor");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "discriminator",
            description: "Provides a list of all uers with a given discriminator.",
            aliases: ["disrcim"],
            usage: "disrciminator [four-digit-discriminator]",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /discrim(?:inator)?\s+#?(\d{4})(?:\s+(\d+))?/i.exec(message.content);

        const discriminator = args[1] || message.author.discriminator;
        const page = args[2] || 1;

        const list = this.client.users.findAll("discriminator", discriminator);
        if (!list.size) response.reply(`There are no users with the discriminator **${discriminator}** on record.`);

        const content = this.client.functions.pagify(
            list.map(u => `${this.client.functions.lengthen(1, u.tag, 30)} ${u.id}`),
            page
        );

        response.send(`**__Users with Discriminator:__** ${discriminator}\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
    }
};
