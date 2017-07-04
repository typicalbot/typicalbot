const Command = require("../../Structures/Command.js");
const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "adcheck",
            description: "Check if any members of a server have a server invite in their playing status.",
            usage: "adcheck",
            mode: "strict",
            permission: 2
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        const members = message.guild.members.filter(m => m.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(m.user.presence.game.name));

        const list = members.map(m => `» ${m.displayName} (${m.id}) | ${m.user.presence.game.name}`);

        const embed = new MessageEmbed().setColor(0xFF0000).setTitle("User with Invite in Playing Status").setDescription(list.length ? list.join("\n\n").substring(0, 2000) : "No users to display.");

        return message.channel.send("", { embed });
    }
};
