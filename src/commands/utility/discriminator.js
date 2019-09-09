const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Provides a list of all uers with a given discriminator.",
            usage: "discriminator [four-digit-discriminator]",
            aliases: ["discrim"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters) {
        const args = /#?(\d{4})(?:\s+(\d+))?/i.exec(parameters);

        const discriminator = args && args[1] ? args[1] : message.author.discriminator;
        const page = args && args[2] ? args[2] : 1;

        const list = this.client.users.filter(u => u.discriminator === discriminator);
        if (list.size < 1) return message.reply(`There are no users with the discriminator **${discriminator}** on record.`);

        const content = this.client.functions.pagify(
            list.map(u => `${this.client.functions.lengthen(1, u.tag, 30)} ${u.id}`),
            page
        );

        message.send(`**__Users with Discriminator:__** ${discriminator}\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
    }
};
