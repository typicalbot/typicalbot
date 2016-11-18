module.exports = {
    "reason": {
        mode: "strict",
        permission: 2,
        execute: (message, client) => {
            let match = /reason\s+(\w+)\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let id = match[1], reason = match[2];
            if (!id) return message.channel.sendMessage(`${message.author} | \`❌\` | No ID given.`);
            if (!reason) return message.channel.sendMessage(`${message.author} | \`❌\` | No reason given.`);

            client.modlog.get(message.guild, id).then(log =>{
                if (!log) return message.channel.sendMessage(`${message.author} | \`❌\` | No log under the given ID.`);
                client.modlog.reason(log, message.author, reason).then(() => {
                    message.channel.sendMessage(`${message.author} | :thumbsup::skin-tone-2:`).then(msg => msg.delete(5000));
                }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured: ${err.stack}`));
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured: ${err.stack}`));
        }
    }
};
