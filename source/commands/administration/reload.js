const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "A command to reload modules.",
            usage: "reload <module>",
            permission: Constants.Permissions.TYPICALBOT_ADMINISTRATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const mod = message.content.slice(message.content.search(" ") + 1);

        this.client.transmit("reload", mod);

        message.buildEmbed()
            .setColor(0x00FF00)
            .setDescription(`**Reloading Module:** \`${mod}\``)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
