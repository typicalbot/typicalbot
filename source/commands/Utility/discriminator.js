const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Provides a list of all uers with a given discriminator.",
            aliases: ["discrim"],
            usage: "disrciminator [four-digit-discriminator]",
            mode: "lite"
        });
    }

    execute(message, permissionLevel) {
        const args = /discrim(?:inator)?\s+#?(\d{4})(?:\s+(\d+))?/i.exec(message.content);

        const discriminator = args && args[1] ? args[1] : message.author.discriminator;
        const page = args && args[2] ? args[2] : 1;

        const list = this.client.users.findAll("discriminator", discriminator);
        if (!list.length) return message.reply(`There are no users with the discriminator **${discriminator}** on record.`);

        const content = this.client.functions.pagify(
            list.map(u => `${this.client.functions.lengthen(1, u.tag, 30)} ${u.id}`),
            page
        );

        message.send(`**__Users with Discriminator:__** ${discriminator}\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
    }
};
