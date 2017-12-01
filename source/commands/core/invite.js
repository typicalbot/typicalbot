const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive the OAuth2 authorization link for TypicalBot.",
            usage: "invite",
            dm: true,
            mode: "strict"
        });
    }

    execute(message, parameters, permissionLevel) {
        message.reply(`You can add me to your server at <${this.client.config.urls.oauth}>.`);
    }

    embedExecute(message, response){
        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Invite Link")
            .setDescription(`You can add me to your server [here](${this.client.config.urls.oauth}).`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();
    }
};
