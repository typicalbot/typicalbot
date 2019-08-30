const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Makes the bot unignore commands, invites and stars in a channel.",
            usage: "unignore ['commands'|'invites'|'stars']",
            permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(commands|invites|stars)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const commands = args[1] === "commands", invites = args[1] === "invites", stars = args[1] === "stars";

        if (commands && !message.guild.settings.ignored.commands.includes(message.channel.id)) return message.error("This channel isn't ignoring commands.");
        if (invites && !message.guild.settings.ignored.invites.includes(message.channel.id)) return message.error("This channel isn't ignoring invites.");
        if (stars && !message.guild.settings.ignored.stars.includes(message.channel.id)) {
            if (!message.guild.settings.starboard.id) return message.error("The starboard is not enabled.");
            return message.error("This channel isn't ignoring stars.");
        }

        const newArray = message.guild.settings.ignored[args[1]];
        newArray.splice(newArray.indexOf(message.channel.id), 1);

        this.client.settings.update(message.guild.id, { ignored: { [args[1]]: newArray } }).then(() => message.success(`Now listening to ${args[1]}.`));
    }
};
