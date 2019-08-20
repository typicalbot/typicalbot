const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Selects a random member in the server.",
            usage: "randomuser [-o]",
            aliases: ["ruser"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(?:(-o(?:nline)?))/i.exec(parameters);

        const members = args ? message.guild.members.filter(m => m.presence.status !== "offline") : message.guild.members;
        const user = members.random().user;

        message.send(`Your random pick is: **${user.username}#${user.discriminator}** (${user.id}).`);
    }
};
