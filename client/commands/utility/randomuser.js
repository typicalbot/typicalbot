const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Selects a random member in the server..",
            usage: "randomuser",
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        const user = message.guild.members.random().user;

        message.send(`Your random pick is: **${user.username}#${user.discriminator}** (${user.id}).`);
    }
};
