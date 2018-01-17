const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Grab a link to TypicalBot's documentation.",
            usage: "documentation",
            aliases: ["docs"],
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.send(`**Documentation can be found here:** <${Constants.Links.DOCUMENTATION}>`);
    }

    embedExecute(message, response) {
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Documentation")
            .setDescription(`**Documentation can be found here:** <${Constants.Links.DOCUMENTATION}>`)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
