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
        message.send(`To those who have helped with specific pieces of the bot:\n\nFor creation of the TypicalBot icon.\n» Aklixio#0588 (84430408447426560)`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("Credits")
            .setDescription(`To those who have helped with specific pieces of the bot.`)
            .addField("For creation of the TypicalBot icon.", "» Aklixio#0588 (84430408447426560)")
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
