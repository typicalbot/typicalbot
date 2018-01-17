const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive an invite to the TypicalBot Lounge.",
            usage: "server",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.reply(`You can join the TypicalBot Lounge at <${Constants.Links.SERVER}>.`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Lounge Invite")
            .setDescription(`You can join the TypicalBot Lounge [here](${Constants.Links.SERVER}).`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
