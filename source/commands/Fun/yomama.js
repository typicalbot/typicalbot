const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Gives you a random yomama joke.",
            aliases: ["yomomma"],
            usage: "yomama"
        });
    }

    execute(message, response, permissionLevel) {
        request.get("https://typicalbot.com/api/yomomma/")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(JSON.parse(res.text).response);
            });
    }
};
