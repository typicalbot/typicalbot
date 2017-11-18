const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Grab a link to TypicalBot's documentation.",
            usage: "documentation",
            aliases: ["docs"],
            dm: true,
            mode: "strict"
        });
    }

    execute(message, permissionLevel) {
        message.send(`**Documentation can be found here:** <${this.client.config.urls.docs}>`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Documentation")
            .setDescription(`**Documentation can be found here:** <${this.client.config.urls.docs}>`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();
    }
};
