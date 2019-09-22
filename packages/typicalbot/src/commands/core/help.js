const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Get general information about TypicalBot or help with a specific command.',
            usage: 'help [command]',
            aliases: ['info', 'support'],
            dm: true,
            mode: Constants.Modes.STRICT,
        });
    }

    async execute(message, parameters) {
        if (!parameters) return message.send(`\u200B\t\tHello there, I'm TypicalBot! I was created by HyperCoder#2975 and nsylke#4490. If you would like to access my list of commands, try using \`${this.client.config.prefix}commands\`. If you need any help with commands or settings, you can find documentation at **<${Constants.Links.DOCUMENTATION}>**. If you cannot figure out how to use a command or setting, or would like to chat, you can join us in the TypicalBot Lounge at **<${Constants.Links.SERVER}>**.\n\n\t\t*Built upon over a year of experience, TypicalBot is the ironically-named bot that is far from typical. Stable, lightning fast, and easy to use, TypicalBot is there for you and will seamlessly help you moderate your server and offer some entertaining features for your users, every step of the way.*`);

        const command = await this.client.commands.fetch(parameters, message.guild.settings.aliases);
        if (!command) return message.error(`There is not a command named \`${parameters}\`. Try searching something else.`);

        message.send(
            `**__Usage For:__** ${parameters}\n`
            + '**[Param]** means a parameter is optional.\n'
            + '**<Param>** means a parameter is required.\n\n'
            + '```\n'
            + `Command        : ${command.name}\n`
            + `Aliases        : ${command.aliases.length ? command.aliases.join(', ') : 'None'}\n`
            + `Permission     : ${command.permission}\n`
            + `Description    : ${this.client.translate(`${command.name}:DESCRIPTION`)}\n`
            + `Usage          : ${this.client.translate(`${command.name}:USAGE`)}`
            + '\n```',
        );
    }

    async embedExecute(message, parameters) {
        if (!parameters) {
            return message.buildEmbed()
                .setColor(0x00ADFF)
                .setTitle('TypicalBot Info')
                .setDescription(`\u200B\t\tHello there, I'm TypicalBot! I was created by HyperCoder#2975 and nsylke#4490. If you would like to access my list of commands, try using \`${this.client.config.prefix}commands\`. If you need any help with commands or settings, you can find documentation at **<${Constants.Links.DOCUMENTATION}>**. If you cannot figure out how to use a command or setting, or would like to chat, you can join us in the TypicalBot Lounge at **<${Constants.Links.SERVER}>**.\n\n\t\t*Built upon over a year of experience, TypicalBot is the ironically-named bot that is far from typical. Stable, lightning fast, and easy to use, TypicalBot is there for you and will seamlessly help you moderate your server and offer some entertaining features for your users, every step of the way.*`)
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
                .send();
        }

        const command = await this.client.commands.fetch(parameters, message.guild.settings.aliases);

        if (!command) {
            return message.buildEmbed()
                .setColor(0x00ADFF)
                .setTitle('Invalid Command Input')
                .setDescription(`The command \`${parameters}\` does not exist.`)
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
                .send();
        }

        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Command Usage: ${parameters}`)
            .setDescription('• [[Parameter]]() - Optional Parameter\n• [<Parameter>]() - Required Parameter')
            .addField('» Command', command.name, true)
            .addField('» Aliases', command.aliases.length ? command.aliases.join(', ') : 'None')
            .addField('» Permission', command.permission)
            .addField('» Description', command.description)
            .addField('» Usage', command.usage)
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
