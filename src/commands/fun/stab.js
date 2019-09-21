const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Stab' another user in the server.",
            usage: 'stab [@user]',
        });
    }

    execute(message) {
        const mention = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id) return message.send(`${message.author} just stabbed themselves! :dagger::scream:${randomAddon ? ' Someone call the police!' : ''}`);
        message.send(`${message.author} just stabbed ${mention}! :dagger::scream:${randomAddon ? ' Someone call the police!' : ''}`);
    }
};
