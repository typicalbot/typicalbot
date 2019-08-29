const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Makes the bot ignore commands or invites in a channel.",
            usage: "ignore ['view'|'commands'|'invites'|'stars']",
            permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(commands|invites|stars|view)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const commands = args[1] === "commands", invites = args[1] === "invites", stars = args[1] === "stars", view = args[1] === "view";

        if (view) {
            const commandsArr = message.guild.settings.ignored.commands;
            const invitesArr = message.guild.settings.ignored.invites;
            const starsArr = message.guild.settings.ignored.stars;

            let msg = "The following channels are ignoring **Commands**:\n";

            if (commandsArr.length === 0) {
                msg += "n/a";
            } else {
                for (let channel in commandsArr) {
                    msg += `<#${commandsArr[channel]}> `;
                }
            }

            msg += "\n\nThe following channels are ignoring **Invites**:\n";
            if (invitesArr.length === 0) {
                msg += "n/a";
            } else {
                for (let channel in invitesArr) {
                    msg += `<#${invitesArr[channel]}> `;
                }
            }

            msg += "\n\nThe following channels are ignoring **Stars**:\n";
            if (starsArr.length === 0) {
                msg += "n/a";
            } else {
                for (let channel in starsArr) {
                    msg += `<#${starsArr[channel]}> `;
                }
            }

            return message.send(msg);
        }
        if (commands && message.guild.settings.ignored.commands.includes(message.channel.id)) return message.error("This channel is already ignoring commands.");
        if (invites && message.guild.settings.ignored.invites.includes(message.channel.id)) return message.error("This channel is already ignoring invites.");
        if (stars && message.guild.settings.ignored.stars.includes(message.channel.id)) {
            if (!message.guild.settings.starboard.id) return message.error("The starboard is not enabled.");
            return message.error("This channel is already ignoring stars.");
        }

        const newArray = message.guild.settings.ignored[args[1]];
        newArray.push(message.channel.id);

        this.client.settings.update(message.guild.id, { ignored: { [args[1]]: newArray } }).then(() => message.success(`Now ignoring ${args[1]}.`));
    }
};
