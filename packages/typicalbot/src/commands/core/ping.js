const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'A check to see if TypicalBot is able to respond.',
            usage: 'ping',
            dm: true,
            mode: Constants.Modes.STRICT,
        });
    }

    async execute(message) {
        const ping = await message.send('Calculating command execution time and Discord API latency...');

        ping.edit(`Command Execution Time : ${ping.createdTimestamp - message.createdTimestamp}ms | Discord API Latency : ${Math.floor(this.client.ws.ping)}ms`);
    }
};
