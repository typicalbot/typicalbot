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

    execute(message, permissionLevel) {
        request.get("http://random.cat/meow")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.file);
            });
    }

    embedExecute(message, permissionLevel) {
        request.get("http://random.cat/meow")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.buildEmbed().setColor(0x00adff).setImage(res.body.file).send();
            });
    }
};
