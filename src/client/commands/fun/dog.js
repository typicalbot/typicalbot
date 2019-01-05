const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random dog picture.",
            usage: "dog",
            aliases: ["puppy", "doggy"]
        });
    }

    execute(message, parameters, permissionLevel) {
        request.get("https://dog.ceo/api/breeds/image/random")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.send(res.body.data[0].message);
            });
    }

    embedExecute(message, parameters, permissionLevel) {
        request.get("https://dog.ceo/api/breeds/image/random")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.buildEmbed().setColor(0x00adff).setImage(res.body.data[0].message).send();
            });
    }
};
