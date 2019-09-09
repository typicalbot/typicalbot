const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Generate and view API keys.",
            usage: "api <'view'|'generate'>",
            permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters) {
        if (parameters === "view") {
            message.dm(`${message.guild.name}'s API Key:\n${message.guild.settings.apikey ? `\`${message.guild.settings.apikey}\``: "No API key exists. Use `$api generate` to generate one."}`);
        } else if (parameters === "generate") {
            const newApiKey = `${Buffer.from(message.guild.id.toString()).toString("base64")}.${Buffer.from(Date.now().toString()).toString("base64")}`;

            this.client.settings.update(message.guild.id, {
                apikey: newApiKey
            }).then(() => message.success("API key successfully generated."));

            message.dm(`${message.guild.name}'s API Key:\n\`${newApiKey}\``);
        } else {
            message.error("Invalid option given.");
        }
    }
};
