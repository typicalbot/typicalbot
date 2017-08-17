const Command = require("../../structures/Command");
const request = require('superagent');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "urban",
            description: "Grabs the definition from Urban Dictionary for the specified word.",
            usage: "urban <query>"
        });
    }

    execute(message, response, permissionLevel) {
        const args  = /urban (.*)/gi.exec(message.content);
        if (!args) return response.usage(this);

        const query = args[1];
       
        request
            .get(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .end((err, res) => {
                if(err) return response.error("An error occured while trying to complete this request");

                const resp = res.body.list[0];
                if(!resp) return response.error(`No matches for the query **"${query}"**.`);

                message.channel.buildEmbed()
                    .setColor(0x00adff)
                    .setTitle(query)
                    .setURL(resp.permalink)
                    .addField(`Definition 1 out of ${res.body.list.length}`, `\n\u200B    ${resp.definition}`)
                    .addField("Rating", `\u200B    \\👍  ${resp.thumbs_up}    |    \\👎  ${resp.thumbs_down}    |    ${Math.round((resp.thumbs_up/(resp.thumbs_up + resp.thumbs_down))*100)}% of ${resp.thumbs_up + resp.thumbs_down} like this definition.`)
                    .setThumbnail("http://i.imgur.com/CcIZZsa.png")
                    .setFooter("Urban Dictionary Defintion")
                    .send();
            });
    }
};
