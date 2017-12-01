const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random cat picture.",
            aliases: ["kitty", "kitten"],
            usage: "cat"
        });
    }

    execute(message, parameters, permissionLevel) {
        request.get("http://random.cat/meow")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.send(res.body.file);
            });
    }

    embedExecute(message, parameters, permissionLevel) {
        request.get("http://random.cat/meow")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.buildEmbed().setColor(0x00adff).setImage(res.body.file).send();
            });
    }
};
