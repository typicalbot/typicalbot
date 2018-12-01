const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random yomama joke.",
            usage: "yomama",
            aliases: ["yomomma"]
        });
    }

    execute(message, parameters, permissionLevel) {
        // https://typicalbot.com/api/yomomma/
        request.get("https://api.yomomma.info/")
            .end((err, res) => {
                if (err) return message.error("An error occured making that request.");

                return message.send(JSON.parse(res.text).joke);
            });
    }
};
