const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random yomama joke.",
            usage: "yomama",
            aliases: ["yomomma"]
        });
    }

    execute(message) {
        fetch("https://api.yomomma.info")
            .then(res => res.json())
            .then(json => message.send(json.joke))
            .catch(err => message.error("An error occurred making that request."));
    }
};
