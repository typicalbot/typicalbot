const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Grabs the definition from Urban Dictionary for the specified word.",
            usage: "urban <query>"
        });
    }

    execute(message, permissionLevel) {
        const args = /urban\s+(.*)/gi.exec(message.content);
        if (!args) return response.usage(this);

        const query = args[1];

        request
            .get(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .end((err, res) => {
                if (err) return response.error("An error occured while trying to complete this request.");

                const resp = res.body.list[0];
                if (!resp) return response.error(`No matches for the query **${query}**.`);

                response.reply(`**__${query}:__** ${resp.definition}`);
            });
    }

    embedExecute(message, permissionLevel) {
        const args = /urban (.*)/gi.exec(message.content);
        if (!args) return response.usage(this);

        const query = args[1];

        request
            .get(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .end((err, res) => {
                if (err) return response.buildEmbed().setColor(0xFF0000).setDescription("An error occured while trying to complete this request.").send();

                const resp = res.body.list[0];
                if (!resp) return response.buildEmbed().setColor(0xFF0000).setDescription(`No matches for the query **${query}**.`).send();

                const rating = Math.round((resp.thumbs_up/(resp.thumbs_up + resp.thumbs_down))*100);

                response.buildEmbed()
                    .setColor(0x00adff)
                    .setTitle(query)
                    .setURL(resp.permalink)
                    .addField(`Definition 1 out of ${res.body.list.length}`, `\n\u200B    ${resp.definition}`)
                    .addField("Rating", `\u200B    \\👍  ${resp.thumbs_up}    |    \\👎  ${resp.thumbs_down}${!isNaN(rating) ? `    |    ${rating}% of ${resp.thumbs_up + resp.thumbs_down} like this definition.` : ""}`)
                    .setThumbnail("http://i.imgur.com/CcIZZsa.png")
                    .setFooter("Urban Dictionary Defintion")
                    .send();
            });
    }
};
