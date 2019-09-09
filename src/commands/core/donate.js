const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Donate to support the development of TypicalBot.",
            usage: "donate",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message) {
        message.send(`You can donate to support the continued development of TypicalBot at **<${Constants.Links.DONATE}>** to help support my growth, development, and stability.`);
    }

    embedExecute(message) {
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Support the TypicalBot Project")
            .setDescription(`You can donate support the continued development of TypicalBot at **<${Constants.Links.DONATE}>** to help support my growth, development, and stability.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
