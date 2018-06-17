const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Purge messages in a channel.",
            usage: "purge [@user|#channel|@role|'me'|'you'|'bots'] <message-count>",
            aliases: ["prune"],
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:(?:<@!?(\d{17,20})>|(\d{17,20})|<@&(\d{17,20})>|<#(\d{17,20})>|(you|me|bots))\s+)?(\d+)(?:\s+((?:.|[\r\n])+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const userFilter = args[1] || args[2];
        const roleFilter = args[3] ? message.guild.roles.get(args[3]) : null;
        const channelFilter = args[4] ? message.guild.channels.get(args[4]) : null;
        const otherFilter = args[5];
        const reason = args[7];

        let messageCount = args[6]; if (messageCount > 100) messageCount = 100;
        if (messageCount < 1) return message.error("Please provide a number of messages to delete from 1 to 100.");

        let messages = await message.channel.messages.fetch({ limit: 100, before: message.id });

        if (userFilter) {
            messages = messages.filter(m => m.author.id === userFilter).array().splice(0, messageCount);
        } else if (roleFilter) {
            const members = roleFilter.members.map(m => m.id);
            messages = messages.filter(m => members.includes(m.author.id)).array().splice(0, messageCount);
        } else if (channelFilter) {
            messages = await channelFilter.messages.fetch({ limit: messageCount });
        } else if (otherFilter === "me") {
            messages = messages.filter(m => m.author.id === message.author.id).array().splice(0, messageCount);
        } else if (otherFilter === "you") {
            messages = messages.filter(m => m.author.id === message.guild.me.id).array().splice(0, messageCount);
        } else if (otherFilter === "bots") {
            const bots = message.guild.members.filter(m => m.user.bot).map(b => b.id);
            messages = messages.filter(m => bots.includes(m.author.id)).array().splice(0, messageCount);
        } else {
            messages = messages.array().splice(0, messageCount);
        }

        if (channelFilter) return channelFilter.bulkDelete(messages, true)
            .then(async msgs => {
                if (message.guild.settings.logs.moderation && message.guild.settings.logs.purge) {
                    const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.PURGE).setModerator(message.author).setChannel(channelFilter);
                    if (reason) newCase.setReason(reason); newCase.send();
                }

                if (msgs.size === 0) {
                    message.reply(`No messages were deleted. This likely means I lack the permission to read message history or the messages are over two weeks old.`);
                    message.delete({ timeout: 2500 }).catch(() => { });
                } else {
                    message.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`)
                        .then(msg => msg.delete({ timeout: 2500 }).catch(() => { }));
                    message.delete({ timeout: 2500 }).catch(() => { });
                }
            })
            .catch(err => message.error(`An error occured. This most likely means I do not have permissions to manage messages.`));

        message.channel.bulkDelete(messages, true)
            .then(async msgs => {
                if (message.guild.settings.logs.moderation && message.guild.settings.logs.purge) {
                    const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.PURGE).setModerator(message.author).setChannel(message.channel);
                    if (reason) newCase.setReason(reason); newCase.send();
                }

                if (msgs.size === 0) {
                    message.reply(`No messages were deleted. This likely means I lack the permission to read message history or the messages are over two weeks old.`);
                    message.delete({ timeout: 2500 }).catch(() => { });
                } else {
                    message.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`)
                        .then(msg => msg.delete({ timeout: 2500 }).catch(() => { }));
                    message.delete({ timeout: 2500 }).catch(() => { });
                }
            })
            .catch(err => message.error(`An error occured. This most likely means I do not have permissions to manage messages.`));
    }
};
