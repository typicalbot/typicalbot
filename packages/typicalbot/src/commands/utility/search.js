const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Searches in the user list for a username or nickname.',
            usage: 'search <query> [page-number]',
            mode: Constants.Modes.LITE,
        });
    }

    execute(message, parameters) {
        const args = /(\S+)(?:\s+(\d+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const query = args[1];
        const page = args[2] || 1;

        const list = message.guild.members.filter((m) => {
            if (m.user.username.toLowerCase().includes(query.toLowerCase())) return true;
            if (m.nickname && m.nickname.toLowerCase().includes(query.toLowerCase())) return true;
            return false;
        });

        if (!list.size) return message.reply(`There are no matches for the query **${query}**.`);

        const content = this.client.functions.pagify(
            list.map((m) => `${this.client.functions.lengthen(1, `${m.user.username}${m.nickname ? ` (${m.nickname})` : ''}`, 40)}: ${m.id}`),
            page,
        );

        message.send(`**__Results for Query:__** ${query}\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
    }
};
