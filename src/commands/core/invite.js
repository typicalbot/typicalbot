const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive the OAuth2 authorization link for TypicalBot.",
            usage: "invite",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message) {
        message.reply(`You can add me to your server at <${Constants.Links.OAUTH}>.`);
    }

    embedExecute(message) {
        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Invite")
            .setDescription(`You can add me to your server [here](${Constants.Links.OAUTH}).`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
