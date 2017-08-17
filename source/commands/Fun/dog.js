const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "dog",
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
};
