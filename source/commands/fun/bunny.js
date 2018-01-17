const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random bunny picture.",
            usage: "bunny",
            aliases: ["rabbit"]
        });
    }

    execute(message, parameters, permissionLevel) {
        const type = Math.random() <= 0.25 ? "gif" : "poster";

        request.get(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.send(res.body.media[type]);
            });
    }

    embedExecute(message, parameters, permissionLevel) {
        const type = Math.random() <= 0.25 ? "gif" : "poster";

        request.get(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.buildEmbed().setColor(0x00adff).setImage(res.body.media[type]).send();
            });
    }
};
