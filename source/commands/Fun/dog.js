const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Gives you a random dog picture.",
            aliases: ["puppy", "doggy"],
            usage: "dog"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("https://api.thedogapi.co.uk/v2/dog.php?limit=1")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.data[0].url);
            });
    }

    embedExecute(message, response, permissionLevel) {
        request.get("https://api.thedogapi.co.uk/v2/dog.php?limit=1")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.buildEmbed().setColor(0x00adff).setImage(res.body.data[0].url).send();
            });
    }
};
