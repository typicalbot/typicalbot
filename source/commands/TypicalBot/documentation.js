const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Grab a link to TypicalBot's documentation.",
            usage: "documentation",
            aliases: ["docs"],
            dm: true,
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        response.send(`**Documentation can be found here:** <${this.client.config.urls.docs}>`);
    }

    embedExecute(message, response){
        response.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Documentation")
            .setDescription(`**Documentation can be found here:** <${this.client.config.urls.docs}>`)
            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
            .setTimestamp()
            .send();
    }
};
