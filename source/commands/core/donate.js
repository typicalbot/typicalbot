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
        message.send(`**Donations can be sent here:** <${Constants.Links.DONATE}>\n\nDonations go to the creator of TypicalBot for any finances.`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Donate to TypicalBot's Creator")
            .setDescription(`You can donate to TypicalBot [here](${Constants.Links.DONATE}>).\n\nDonations go to the creator of TypicalBot for any finances.`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
