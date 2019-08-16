const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives a list of bots from Carbonitex ranked by server count.",
            usage: "bots [page-number]",
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(\d+)?/i.exec(parameters);

        fetch("https://www.carbonitex.net/discord/api/listedbots")
            .then(res => res.json())
            .then(json => {
                const page = args[1] || 1;

                const bots = json
                    .filter(bot => bot.botid > 10 && bot.servercount > 0)
                    .sort((a, b) => b.servercount - a.servercount)
                    .filter(bot => bot.name = bot.name.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, ""))
                    .filter(bot => bot.servercount = Number(bot.servercount).toLocaleString());

                const content = this.client.functions.pagify(
                    bots.map(bot => `${this.client.functions.lengthen(1, `${bot.name}`, 20)}: ${bot.servercount}${bot.compliant ? ` | Carbon Compliant` : ""}`),
                    page
                );
        
                message.send(`**__Ranked Bot List - Provided by Carbonitex:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
            })
            .catch(err => message.error("An error occurred making that request."));
    }
};
