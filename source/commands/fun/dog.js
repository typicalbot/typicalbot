const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random dog picture.",
            aliases: ["puppy", "doggy"],
            usage: "dog"
        });
    }

    execute(message, parameters, permissionLevel) {
        request.get("https://api.thedogapi.co.uk/v2/dog.php?limit=1")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.send(res.body.data[0].url);
            });
    }

    embedexecute(message, parameters, permissionLevel) {
        request.get("https://api.thedogapi.co.uk/v2/dog.php?limit=1")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.buildEmbed().setColor(0x00adff).setImage(res.body.data[0].url).send();
            });
    }
};
