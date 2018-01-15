const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get general information about TypicalBot or help with a specific command.",
            usage: "help [command]",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!parameters) return message.send(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${Constants.Links.DOCUMENTATION}>. If you need help, join us in the TypicalBot Lounge at <${Constants.Links.SERVER}>.`);

        const command = await this.client.commands.fetch(parameters, message.guild.settings.aliases);
        if (!command) return message.error(`The command \`${parameters}\` does not exist.`);

        message.send(
            `**__Usage For:__** ${parameters}\n`
            + `**[Param]** means a parameter is optional.\n`
            + `**<Param>** means a parameter is required.\n\n`
            + `\`\`\`\n`
            + `Command        : ${command.name}\n`
            + `Aliases        : ${command.aliases.length ? command.aliases.join(", ") : "None"}\n`
            + `Description    : ${command.description}\n`
            + `Usage          : ${command.usage}`
            + `\n\`\`\``
        );
    }

    async embedExecute(message, parameters, permissionLevel) {
        if (!parameters) return message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Info")
            .setDescription(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${Constants.Links.DOCUMENTATION}>. If you need help, join us in the TypicalBot Lounge at <${Constants.Links.SERVER}>.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();

        const command = await this.client.commands.fetch(parameters, message.guild.settings.aliases);

        if (!command) return message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Invalid Command Input`)
            .setDescription(`The command \`${parameters}\` does not exist.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();

        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Command Usage: ${parameters}`)
            .setDescription(`• [[Parameter]]() - Optional Parameter\n• [<Parameter>]() - Required Parameter`)
            .addField("» Command", command.name, true)
            .addField("» Aliases", command.aliases.length ? command.aliases.join(", ") : "None")
            .addField("» Description", command.description)
            .addField("» Usage", command.usage)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
