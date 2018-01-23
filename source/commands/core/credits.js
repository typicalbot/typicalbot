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
        message.send(`The TypicalBot Team would like to gives thanks to the following people for making contributions to me:\n\nDesigner of TypicalBot's Icon\n» Aklixio#0588 (84430408447426560)`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Credits")
            .setDescription(`The TypicalBot Team would like to gives thanks to the following people for making contributions to me:`)
            .addField("Designer of TypicalBot's Icon:", "» Aklixio#0588 (84430408447426560)")
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
