const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Check if any members of a server have a server invite in their playing status.",
            usage: "adcheck",
            mode: "strict",
            permission: 2
        });
    }

    execute(message, parameters, permissionLevel) {
        const members = message.guild.members.filter(m => m.user.presence.activity && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(m.user.presence.activity.name));

        const list = members.map(m => `» ${m.displayName} (${m.id}) | ${m.user.presence.activity.name}`);

        message.buildEmbed()
            .setColor(0xFF0000)
            .setTitle("Users with Invite in Playing Status")
            .setDescription(list.length ? list.join("\n\n").substring(0, 2000) : "No users to display.")
            .send();
    }
};
