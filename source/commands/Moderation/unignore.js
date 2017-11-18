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

    execute(message, permissionLevel) {
        const args = /unignore\s+(commands|invites)/i.exec(message.content);
        if (!args) return response.usage(this);

        const commands = args[1] === "commands", invites = args[1] === "invites";

        if (commands && !message.guild.settings.ignored.commands.includes(message.channel.id)) return response.error("This channel isn't ignoring commands.");
        if (invites && !message.guild.settings.ignored.invites.includes(message.channel.id)) return response.error("This channel isn't ignoring invites.");

        const newArray = message.guild.settings.ignored[commands ? "commands" : "invites"];
        newArray.splice(newArray.indexOf(message.channel.id), 1);

        this.client.settings.update(message.guild.id, { ignored: { [commands ? "commands" : "invites"]: newArray }}).then(() => response.success(`Now listening to ${commands ? "commands" : "invites"}.`));
    }
};
