const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Gives you a random tiger picture.',
            usage: 'tiger',
        });
    }

    execute(message) {
        return message.error('An error occurred making that request.');
        // request.get("https://typicalbot.com/api/tiger/")
        //     .end((err, res) => {
        //         if (err) return message.error("An error occured making that request.");

        //         return message.send(JSON.parse(res.text).response);
        //     });
    }

    embedExecute(message) {
        return message.error('An error occurred making that request.');
        // request.get("https://typicalbot.com/api/tiger/")
        //     .end((err, res) => {
        //         if (err) return message.error("An error occured making that request.");

        //         return message.buildEmbed().setColor(0x00adff).setImage(JSON.parse(res.text).response).send();
        //     });
    }
};
