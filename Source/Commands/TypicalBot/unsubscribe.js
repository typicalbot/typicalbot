const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "unsubscribe",
            description: "Unsubscribe from TypicalBot's announcements.",
            usage: "unsubscribe",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge inorder to use this command.`);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.removeRole(Role).then(() => {
            response.reply("You are now unsubscribed from TypicalBot's announcements.");
        });
    }
};
