const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Grabs the definition from Urban Dictionary for the specified word.",
            usage: "urban <query>"
        });
    }

    execute(message, parameters) {
        if (!message.channel.nsfw) return message.error("This command can only be used in NSFW channels.");

        const args = /(.*)/gi.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const query = args[1];

        fetch(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .then(res => res.json())
            .then(json => {
                const resp = json.list[0];
                if (!resp) return message.error(`No matches for the query **${query}**.`);

                message.reply(`**__${query}:__** ${resp.definition}`);
            })
            .catch(err => message.error("An error occurred making that request."));
    }

    embedExecute(message) {
        if (!message.channel.nsfw) return message.error("This command can only be used in NSFW channels.");

        const args = /urban (.*)/gi.exec(message.content);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const query = args[1];

        fetch(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .then(res => res.json())
            .then(json => {
                const resp = json.list[0];
                if (!resp) return message.error(`No matches for the query **${query}**.`);

                const rating = Math.round((resp.thumbs_up / (resp.thumbs_up + resp.thumbs_down)) * 100);

                message.buildEmbed()
                    .setColor(0x00adff)
                    .setTitle(query)
                    .setURL(resp.permalink)
                    .addField(`Definition 1 out of ${json.length}`, `\n\u200B    ${resp.definition}`)
                    .addField("Rating", `\u200B    \\👍  ${resp.thumbs_up}    |    \\👎  ${resp.thumbs_down}${!isNaN(rating) ? `    |    ${rating}% of ${resp.thumbs_up + resp.thumbs_down} like this definition.` : ""}`)
                    .setThumbnail("http://i.imgur.com/CcIZZsa.png")
                    .setFooter("Urban Dictionary Defintion")
                    .send();
            })
            .catch(err => message.error("An error occurred making that request."));
    }
};
