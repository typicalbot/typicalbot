const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Purge messages in a channel.",
            aliases: ["prune"],
            usage: "purge [@user|#channel|@role|'me'|'you'|'bots'] <message-count>",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /(?:purge|prune)(?:\s+(?:<@!?(\d{17,20})>|<@&(\d{17,20})>|<#(\d{17,20})>|(you|me|bots)))?\s+(\d+)/i.exec(message.content);
        if (!args) return response.usage(this);

        const userFilter = args[1];
        const roleFilter = args[2] ? message.guild.roles.get(args[2]) : null;
        const channelFilter = args[3] ? message.guild.channels.get(args[3]) : null;
        const otherFilter = args[4];

        let messageCount = args[5]; if (messageCount > 100) messageCount = 100;
        if (messageCount < 1) return response.error("Please provide a number of messages to delete from 1 to 100.");

        let messages = await message.channel.messages.fetch({ limit: 100, before: message.id });

        if (userFilter) {
            messages = messages.filterArray(m => m.author.id === userFilter).splice(0, messageCount);
        } else if (roleFilter) {
            const members = roleFilter.members.map(m => m.id);
            messages = messages.filterArray(m => members.includes(m.author.id)).splice(0, messageCount);
        } else if (channelFilter) {
            messages = await channelFilter.messages.fetch({ limit: messageCount });
        } else if (otherFilter === "me") {
            messages = messages.filterArray(m => m.author.id === message.author.id).splice(0, messageCount);
        } else if (otherFilter === "you") {
            messages = messages.filterArray(m => m.author.id === message.guild.me.id).splice(0, messageCount);
        } else if (otherFilter === "bots") {
            const bots = message.guild.members.filter(m => m.user.bot).map(b => b.id);
            messages = messages.filterArray(m => bots.includes(m.author.id)).splice(0, messageCount);
        } else {
            messages = messages.array().splice(0, messageCount);
        }

        if (channelFilter) return channelFilter.bulkDelete(messages, true)
            .then(msgs => {
                response.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`)
                    .then(msg => msg.delete({ timeout: 2500 }));
                message.delete({ timeout: 2500 });
            })
            .catch(err => response.error(`An error occured. This most likely means I do not have permissions to manage messages.`));

        message.channel.bulkDelete(messages, true)
            .then(msgs => {
                response.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`)
                    .then(msg => msg.delete({ timeout: 2500 }));
                message.delete({ timeout: 2500 });
            })
            .catch(err => response.error(`An error occured. This most likely means I do not have permissions to manage messages.`));
    }
};
