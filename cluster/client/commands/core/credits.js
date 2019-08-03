const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Give credit to those who have contributed to the bot.",
            usage: "credits",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.send(`The TypicalBot Team would like to give thanks to the following people for making contributions to me:\n\n» Aklixio#0588 (84430408447426560) - Designer of TypicalBot's icon.`);
    }

    embedExecute(message, response) {
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Credits")
            .setDescription(`The TypicalBot Team would like to give thanks to the following people for making contributions to me:`)
            .addField("» Aklixio#0588 (84430408447426560)", "Designer of TypicalBot's icon.")
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
