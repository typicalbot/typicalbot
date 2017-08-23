const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "search",
            description: "Searches in the user list for a username or nickname.",
            usage: "search <query>",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /search\s+(\S+)(?:\s+(\d+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const query = args[1];
        const page = args[2] || 1;

        const list = message.guild.members.filter(m => {
            if (m.user.username.toLowerCase().includes(query.toLowerCase())) return true;
            if (m.nickname && m.nickname.toLowerCase().includes(query.toLowerCase())) return true;
            return false;
        });

        if (!list.size) return response.reply(`There are no matches for the query **${query}**.`);

        const content = this.client.functions.pagify(
            list.map(m => `${this.client.functions.lengthen(1, `${m.user.username}${m.nickname ? ` (${m.nickname})` : ""}`, 40)}: ${m.id}`),
            page
        );

        response.send(`**__Results:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
    }
};
