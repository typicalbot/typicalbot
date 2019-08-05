const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random cat picture.",
            usage: "cat",
            aliases: ["kitty", "kitten"]
        });
    }

    execute(message, parameters, permissionLevel) {
        fetch("https://aws.random.cat/meow")
            .then(res => res.json())
            .then(json => message.send(json.file))
            .catch(err => message.error("An error occurred making that request."));
    }

    embedExecute(message, parameters, permissionLevel) {
        fetch("https://aws.random.cat/meow")
            .then(res => res.json())
            .then(json => message.buildEmbed().setColor(0x00adff).setImage(json.file).send())
            .catch(err => message.error("An error occurred making that request."));
    }
};
