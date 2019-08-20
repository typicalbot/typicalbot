const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Selects a random member in the server.",
            usage: "randomuser [online]",
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        const members = parameters === "online" ? message.guild.members.filter(m => m.presence.status === "online") : message.guild.members;
        const user = members.random().user;

        message.send(`Your random pick is: **${user.username}#${user.discriminator}** (${user.id}).`);
    }
};
