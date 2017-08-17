const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "tiger",
            description: "Gives you a random tiger picture.",
            usage: "tiger"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("https://typicalbot.com/api/tiger/")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.response);
            });
    }
};
