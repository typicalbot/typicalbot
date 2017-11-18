const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive a list of TypicalBot's commands.",
            aliases: ["cmds"],
            usage: "commands",
            dm: true,
            mode: "strict"
        });
    }

    execute(message, permissionLevel) {
        if (message.channel.type === "text") response.reply(`Check your Direct Messages for my commands!`);

        const commands = this.client.commands;
        const list = Array.from(commands.keys());

        const level0 = list.filter(c => commands._get(c).permission === 0).map(c => `${this.client.config.prefix}${c}`);
        const level1 = list.filter(c => commands._get(c).permission === 1).map(c => `${this.client.config.prefix}${c}`);
        const level2 = list.filter(c => commands._get(c).permission === 2).map(c => `${this.client.config.prefix}${c}`);
        const level3 = list.filter(c => commands._get(c).permission === 3).map(c => `${this.client.config.prefix}${c}`);
        const level4 = list.filter(c => commands._get(c).permission === 4).map(c => `${this.client.config.prefix}${c}`);

        response.dm(
            `**__TypicalBot's Commands:__**\nView Usage Here: ${this.client.config.urls.docs}\n\n`
            + `__**Permission Level 4:** Server Owner__\n${level4.join(", ")}\n\n`
            + `__**Permission Level 3:** Server Administrator__\n${level3.join(", ")}\n\n`
            + `__**Permission Level 2:** Server Moderator__\n${level2.join(", ")}\n\n`
            + `__**Permission Level 1:** Server DJ__\n${level1.join(", ")}\n\n`
            + `__**Permission Level 0:** Server Member__\n${level0.join(", ")}\n\n`
            + `__**Permission Level -1:** Server Blacklisted__\nNo commands are available to this level. This level can be given with the \`blacklistrole\` setting.`
        );
    }
};
