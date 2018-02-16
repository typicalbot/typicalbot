const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Makes the bot unignore commands or invites in a channel.",
            usage: "unignore ['commands'|'invites']",
            permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(commands|invites)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const commands = args[1] === "commands", invites = args[1] === "invites";

        if (commands && !message.guild.settings.ignored.commands.includes(message.channel.id)) return message.error("This channel isn't ignoring commands.");
        if (invites && !message.guild.settings.ignored.invites.includes(message.channel.id)) return message.error("This channel isn't ignoring invites.");

        const newArray = message.guild.settings.ignored[commands ? "commands" : "invites"];
        newArray.splice(newArray.indexOf(message.channel.id), 1);

        this.client.settings.update(message.guild.id, { ignored: { [commands ? "commands" : "invites"]: newArray }}).then(() => message.success(`Now listening to ${commands ? "commands" : "invites"}.`));
    }
};
