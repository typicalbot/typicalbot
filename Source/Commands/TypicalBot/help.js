const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Get general information about TypicalBot or help with a specific command.",
            usage: "help [command]",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let commandInput = message.content.split(" ")[1];
        if (!commandInput) return response.send(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`);

        let command = this.client.commandsManager.get(commandInput);
        if (!command) return response.error(`That isn't in my list of commands!`);

        response.send(
            `**__Usage For:__** ${commandInput}\n`
            + `**[Param]** means a parameter is optional.\n`
            + `**<Param>** means a parameter is required.\n\n`
            + `\`\`\`\n`
            + `Command        : ${command.name}\n`
            + `Aliases        : ${command.aliases.length ? command.aliases.join(", ") : "None"}\n`
            + `description    : ${command.description}`
            + `\n\`\`\``
        );
    }

    embedExecute(message, response){
        let commandInput = message.content.split(" ")[1];
        let command = this.client.commandsManager.get(commandInput);
        let blank = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("TypicalBot Info")
        .setDescription(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`);

        let reponseCommand = new RichEmbed()
        .setColor(0x00adff)
        .setTitle(`**__Usage For:__** ${commandInput}`)
        .setDescription(`**[Param]** means a parameter is optional.\n`
                        + `**<Param>** means a parameter is required.\n\n`
                        +`\`\`\`\n`
                        + `Command: ${command.name}\n`
                        + `Aliases: ${command.aliases.length ? command.aliases.join(", ") : "None"}\n`
                        + `Description: ${command.description}`
                        );

        let errorCommand = new RichEmbed()
        .setColor(0xFF0000)
        .setTitle(`Error`)
        .setDescription(`That isn't in my list of commands!`)

        if (!commandInput) return response.embed(blank);
        if (!command) return response.embed(errorCommand);

        reponse.embed(reponseCommand);
    }
};
