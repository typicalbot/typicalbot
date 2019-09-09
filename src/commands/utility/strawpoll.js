const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Create a strawpoll vote. Use the '-m' flag for multiple choice.",
            usage: "strawpoll ['-m'] <question> | Choice1; Choice2; Choice+"
        });
    }

    execute(message, parameters) {
        const args = /(?:(-m)\s+)?(.+)\s+\|\s+(.+)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const multi = !!args[1];
        const question = args[2];
        const answers = args[3];

        const list = answers.split(/\s*;\s*/i);
        if (list.length < 2 || list.length > 30) return message.error("There must be between 2 and 30 choices for the strawpoll to be created.");

        fetch("https://www.strawpoll.me/api/v2/polls", {
            method: "post",
            body: JSON.stringify({
                "title": question,
                "options": list,
                "multi": multi
            })
        })
            .then(res => res.json())
            .then(json => message.reply(`Your strawpoll has been created! <https://strawpoll.me/${json.id}>`))
            .catch(err => message.error("An error has occurred making that request."));
    }
};
