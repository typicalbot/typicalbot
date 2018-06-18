const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

const config = require(`${process.cwd()}/config`);

const snekfetch = require("snekfetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives a list of bots from Carbonitex ranked by server count.",
            usage: "bots [page-number]",
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(lookup|subscribe|unsubscribe)(?:\s+(\w+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const action = args[1], login = args[2];

        if (action === "lookup") {
            if (!login) return message.error(this.client.functions.error("usage", this));

            const { body } = await snekfetch
                .get(`https://api.twitch.tv/helix/users?login=${login}`)
                .set("Client-ID", config.apis.twitch.client_id)
                .catch(() => null);

            if (!body || !body.data.length) return message.error("Couldn't find user.");

            console.log(body);
            console.log(body.data);
            console.log(body.data[1]);

            message.reply(`${body.data[1].display_name}: https://www.twitch.tv/${body.data[1].login}`);
        } else if (action === "subscribe") {

        } else if (action === "unsubscribe") {
            
        }
    }
};
