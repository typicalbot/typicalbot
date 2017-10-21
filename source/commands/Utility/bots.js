const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "Gives a list of bots from Carbonitex ranked by server count.",
            usage: "bots [page-number]",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /bots(?:\s+(\d+))?/i.exec(message.content);

        request.get("https://www.carbonitex.net/discord/api/listedbots").end((err, res) => {
            if (err) return response.error("An error occured making that request.");

            const page = args[1] || 1;

            const bots = res.body
                .filter(bot => bot.botid > 10 && bot.servercount > 0)
                .sort((a,b) => b.servercount - a.servercount)
                .filter(bot => bot.name = bot.name.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, ""))
                .filter(bot => bot.servercount = Number(bot.servercount).toLocaleString());

            const content = this.client.functions.pagify(
                bots.map(bot => `${this.client.functions.lengthen(1, `${bot.name}`, 20)}: ${bot.servercount}${bot.compliant ? ` | Carbon Compliant` : ""}`),
                page
            );

            response.send(`**__Ranked Bot List - Provided by Carbonitex:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
        });
    }
};
