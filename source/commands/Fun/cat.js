const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "cat",
            description: "Gives you a random cat picture.",
            aliases: ["kitty", "kitten"],
            usage: "cat"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("http://random.cat/meow")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.file);
            });
    }
};
