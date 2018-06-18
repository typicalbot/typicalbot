const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

const config = require(`${process.cwd()}/config`);

const snekfetch = require("snekfetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Interact with the Twitch API/Webhooks.",
            usage: "twitch <lookup|subscribe|unsubscribe> <twitch-username>",
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(lookup|subscribe|unsubscribe)(?:\s+(\w+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const action = args[1], login = args[2];

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        if (action === "lookup") {
            if (!login) return message.error(this.client.functions.error("usage", this));

            const { body } = await snekfetch
                .get(`https://api.twitch.tv/helix/users?login=${login}`)
                .set("Client-ID", config.apis.twitch.client_id)
                .catch(() => null);

            if (!body || !body.data.length) return message.error("Couldn't find user.");

            message.reply(`${body.data[0].display_name}: https://www.twitch.tv/${body.data[0].login}`);
        } else if (action === "subscribe") {
            if (actualUserPermissions.level < 2) return message.error(this.client.functions.error("perms", { permission: 2 }, actualUserPermissions));

            return message.reply("This command is still being developed.");
        } else if (action === "unsubscribe") {
            if (actualUserPermissions.level < 2) return message.error(this.client.functions.error("perms", { permission: 2 }, actualUserPermissions));

            return message.reply("This command is still being developed.");
        }
    }
};
