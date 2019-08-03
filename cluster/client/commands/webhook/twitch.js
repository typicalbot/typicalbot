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
        return;

        /*
        const args = /(lookup|subscribe|unsubscribe)\s+(\w+)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const action = args[1], login = args[2];

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        if (action === "lookup") {
            const user = await this.client.handlers.webhooks.twitch.lookup(login);

            message.reply(`${user.display_name}: https://www.twitch.tv/${user.login}`);
        } else if (action === "subscribe") {
            if (actualUserPermissions.level < 2) return message.error(this.client.functions.error("perms", { permission: 2 }, actualUserPermissions));

            const user = await this.client.handlers.webhooks.twitch.lookup(login);

            this.client.handlers.webhooks.twitch.addSubscription(message.guild, user.id)
                .then(() => {
                    message.reply("Subscribed!");
                })
                .catch(err => {
                    message.error(err);
                });
        } else if (action === "unsubscribe") {
            if (actualUserPermissions.level < 2) return message.error(this.client.functions.error("perms", { permission: 2 }, actualUserPermissions));

            const user = await this.client.handlers.webhooks.twitch.lookup(login);

            this.client.handlers.webhooks.twitch.deleteSubscription(message.guild, user.id)
                .then(() => {
                    message.reply("Unsubscribed!");
                })
                .catch(err => {
                    message.error(err);
                });
        }
        */
    }
};
