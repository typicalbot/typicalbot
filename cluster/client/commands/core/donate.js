const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Donate to the cause of TypicalBot.",
            usage: "donate",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.send(`You can donate to my creator at **<${Constants.Links.DONATE}>** to help support my growth, development, and stability.`);
    }

    embedExecute(message, response) {
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Donate to TypicalBot's Creator")
            .setDescription(`You can donate to my creator at **<${Constants.Links.DONATE}>** to help support my growth, development, and stability.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
