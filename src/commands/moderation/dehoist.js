const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Check if any members of the server have any special characters in their username.",
            usage: "dehoist",
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message) {
        const members = message.guild.members.filter(m => /^(!|"|#|\$|%|&|'|\(|\)|\*|\+|,|-|\.|\/|\[|\])$/.test(m.displayName.substring(0, 1)));

        const list = members.map(m => `» ${m.displayName} (${m.id})`);

        message.send(list.length ? `There ${list.length === 1 ? "is 1 user" : `are ${list.length} users`} that can be dehoisted:\n\n${list.join("\n").substring(0, 2000)}` : "There are no users that can be dehoisted.");
    }
}
