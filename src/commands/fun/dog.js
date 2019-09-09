const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random dog picture.",
            usage: "dog",
            aliases: ["puppy", "doggy"]
        });
    }

    execute(message) {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())
            .then(json => message.send(json.message))
            .catch(err => message.error("An error occurred making that request."));
    }

    embedExecute(message) {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())
            .then(json => message.buildEmbed().setColor(0x00adff).setImage(json.message).send())
            .catch(err => message.error("An error occurred making that request."));
    }
};
