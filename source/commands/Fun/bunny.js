const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random bunny picture.",
            aliases: ["rabbit"],
            usage: "bunny"
        });
    }

    execute(message, permissionLevel) {
        const type = Math.random() <= 0.25 ? "gif" : "poster";

        request.get(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.media[type]);
            });
    }

    embedExecute(message, permissionLevel) {
        const type = Math.random() <= 0.25 ? "gif" : "poster";

        request.get(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.buildEmbed().setColor(0x00adff).setImage(res.body.media[type]).send();
            });
    }
};
