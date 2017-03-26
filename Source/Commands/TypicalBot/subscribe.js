const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "subscribe",
            description: "Subscribe to TypicalBot's announcements.",
            usage: "subscribe",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge in order to use this command.`);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.reply("You are now subscribed to TypicalBot's announcements!");
        });
    }
};
