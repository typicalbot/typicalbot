const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Makes the bot unignore commands or invites in a channel.",
            usage: "unignore ['commands'|'invites']",
            mode: "strict",
            permission: 3
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(commands|invites)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const commands = args[1] === "commands", invites = args[1] === "invites";

        if (commands && !message.guildSettings.ignored.commands.includes(message.channel.id)) return message.error("This channel isn't ignoring commands.");
        if (invites && !message.guildSettings.ignored.invites.includes(message.channel.id)) return message.error("This channel isn't ignoring invites.");

        const newArray = message.guildSettings.ignored[commands ? "commands" : "invites"];
        newArray.splice(newArray.indexOf(message.channel.id), 1);

        this.client.settings.update(message.guild.id, { ignored: { [commands ? "commands" : "invites"]: newArray }}).then(() => message.success(`Now listening to ${commands ? "commands" : "invites"}.`));
    }
};
