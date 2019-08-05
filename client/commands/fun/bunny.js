const Command = require("../../structures/Command");
const fetch = require("node-fetch");

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

        fetch(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .then(res => res.json())
            .then(json => message.send(json.media[type]))
            .catch(err => message.error("An error occurred making that request."))
    }

    embedExecute(message, parameters, permissionLevel) {
        const type = Math.random() <= 0.25 ? "gif" : "poster";

        fetch(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .then(res => res.json())
            .then(json => message.buildEmbed().setColor(0x00adff).setImage(json.media[type]).send())
            .catch(err => message.error("An error occurred making that request."))
    }
};
