const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "quote",
            description: "Gives you a random quote.",
            usage: "quote"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("https://typicalbot.com/api/quotes/")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.response);
            });
    }
};
