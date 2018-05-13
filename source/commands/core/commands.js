const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive a list of TypicalBot's commands.",
            usage: "commands",
            aliases: ["cmds"],
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        if (message.channel.type === "text") message.reply(`Check your Direct Messages for my commands!`);

        const list = Array.from(this.client.commands.keys());

        const level4 = list.filter(c => this.client.commands.get(c).permission === 4).map(c => `${this.client.config.prefix}${c}`);
        const level3 = list.filter(c => this.client.commands.get(c).permission === 3).map(c => `${this.client.config.prefix}${c}`);
        const level2 = list.filter(c => this.client.commands.get(c).permission === 2).map(c => `${this.client.config.prefix}${c}`);
        const level1 = list.filter(c => this.client.commands.get(c).permission === 1).map(c => `${this.client.config.prefix}${c}`);
        const level0 = list.filter(c => this.client.commands.get(c).permission === 0).map(c => `${this.client.config.prefix}${c}`);

        message.author.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Commands")
            .setDescription(`Use \`${this.client.config.prefix}help <command>\` to get more information on a specific command.`)
            .addField("» Server Owner", level4.length ? level4.join(", ") : "No commands to display.")
            .addField("» Server Administrator", level3.length ? level3.join(", ") : "No commands to display.")
            .addField("» Server Moderator", level2.length ? level2.join(", ") : "No commands to display.")
            .addField("» Server DJ", level1.length ? level1.join(", ") : "No commands to display.")
            .addField("» Server Member", level0.length ? level0.join(", ") : "No commands to display.")
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
