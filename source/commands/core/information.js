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
        message.send(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${Constants.Links.DOCUMENTATION}>. If you need help, join us in the TypicalBot Lounge at <${Constants.Links.SERVER}>.`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Information")
            .setDescription(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${Constants.Links.DOCUMENTATION}>. If you need help, join us in the TypicalBot Lounge at <${Constants.Links.SERVER}>.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
