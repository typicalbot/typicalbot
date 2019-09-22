const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Gives you a random quote.',
            usage: 'quote',
        });
    }

    execute(message) {
        return message.error('An error occurred making that request.');
        // request.get("https://talaikis.com/api/quotes/random/")
        //     .end((err, res) => {
        //         if (err) return message.error("An error occured making that request.");

        //         return message.send(`*"${JSON.parse(res.text).quote}"* - ${JSON.parse(res.text).author}`);
        //     });
    }
};
