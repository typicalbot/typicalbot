const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Punch' another user in the server.",
            usage: 'punch [@user]',
        });
    }

    execute(message) {
        const mention = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id) return message.send(`${message.author}, stop hitting yourself! :punch::skin-tone-2:`);
        message.send(`${message.author} just punched ${mention}! :punch::skin-tone-2:${randomAddon ? ' Oh, dang! Right to the jaw! That must\'ve hurt!' : ''}`);
    }
};
