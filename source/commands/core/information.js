const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get general information about TypicalBot.",
            usage: "information",
            aliases: ["info"],
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.send(`\u200B\t\tHello there, I'm TypicalBot! I was created by HyperCoder#2975. If you would like to access my list of commands, try using \`${this.client.config.prefix}commands\`. If you need any help with commands or settings, you can find documentation at **<${Constants.Links.DOCUMENTATION}>**. If you cannot figure out how to use a command or setting, or would like to chat, you can join us in the TypicalBot Lounge at **<${Constants.Links.SERVER}>**.\n\n\t\t*Built upon over a year of experience, TypicalBot is the ironically-named bot that is far from typical. Stable, lightning fast, and easy to use, TypicalBot is there for you and will seamlessly help you moderate your server and offer some entertaining features for your users, every step of the way.*`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Information")
            .setDescription(`\u200B\t\tHello there, I'm TypicalBot! I was created by HyperCoder#2975. If you would like to access my list of commands, try using \`${this.client.config.prefix}commands\`. If you need any help with commands or settings, you can find documentation at **<${Constants.Links.DOCUMENTATION}>**. If you cannot figure out how to use a command or setting, or would like to chat, you can join us in the TypicalBot Lounge at **<${Constants.Links.SERVER}>**.\n\n\t\t*Built upon over a year of experience, TypicalBot is the ironically-named bot that is far from typical. Stable, lightning fast, and easy to use, TypicalBot is there for you and will seamlessly help you moderate your server and offer some entertaining features for your users, every step of the way.*`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
