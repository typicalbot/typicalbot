const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "yomama",
            description: "Gives you a random yomama joke.",
            aliases: ["yomomma"],
            usage: "yomama"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("https://typicalbot.com/api/yomomma/")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(res.body.response);
            });
    }
};
