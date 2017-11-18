const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random quote.",
            usage: "quote"
        });
    }

    execute(message, permissionLevel) {
        request.get("https://typicalbot.com/api/quotes/")
            .end((err, res) => {
                if (err) return response.error("An error occured making that request.");

                return response.send(JSON.parse(res.text).response);
            });
    }
};
