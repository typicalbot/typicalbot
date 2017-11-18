const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get general information about TypicalBot or help with a specific command.",
            usage: "help [command]",
            dm: true,
            mode: "strict"
        });
    }

    async execute(message, permissionLevel) {
        const commandInput = message.content.split(" ")[1];
        if (!commandInput) return response.send(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`);

        const command = await this.client.commands.get(commandInput);
        if (!command) return response.error(`The command \`${commandInput}\` does not exist.`);

        response.send(
            `**__Usage For:__** ${commandInput}\n`
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

    async embedExecute(message, permissionLevel) {
        const commandInput = message.content.split(" ")[1];
        const command = await this.client.commands.get(commandInput);

        if (!commandInput) return response.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Info")
            .setDescription(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();

        if (!command) return response.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Invalid Command Input`)
            .setDescription(`The command \`${commandInput}\` does not exist.`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();

        response.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Command Usage: ${commandInput}`)
            .setDescription(`• [[Parameter]]() - Optional Parameter\n• [<Parameter>]() - Required Parameter`)
            .addField("» Command", command.name, true)
            .addField("» Aliases", command.aliases.length ? command.aliases.join(", ") : "None")
            .addField("» Description", command.description)
            .addField("» Usage", command.usage)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();
    }
};
