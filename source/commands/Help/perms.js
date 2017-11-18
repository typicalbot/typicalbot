const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Sends a help embed in regards to permissions.",
            mode: "strict"
        });
    }

    execute(message, permissionLevel) {
        response.buildEmbed()
            .setColor(0x00adff)
            .setTitle("Permission Levels").setURL(this.client.config.urls.website)
            .setDescription(`There are six possible permission levels to have. Commands for all levels can be seen with \`d$commands\`.`)
            .addField("» Blacklisted [-1]", "**Description:** Users with this role are unable to use the bot.\n**Inherits From:** N/A\n**Setup Command:** `$set edit blacklistrole <role-name>`\n**Default Role:** `TypicalBot Blacklisted`")
            .addField("» Server Member [0]", "**Description:** Users with this role are able to use the default commands in the bot.\n**Inherits From:** N/A\n**Setup Command:** N/A\n**Default Role:** N/A")
            .addField("» Server DJ [1]", "**Description:** Users with this role are able to use DJ-only music commands.\n**Inherits From:** `Server Member`\n**Setup Command:** `$set edit djrole <role-name>`\n**Default Role:** N/A")
            .addField("» Server Moderator [2]", "**Description:** Users with this role are able to use moderation commands.\n**Inherits From:** `Server DJ`\n**Setup Command:** `$set edit modrole <role-name>`\n**Default Role:** `TypicalBot Moderator`")
            .addField("» Server Administrator [3]", "**Description:** Users with this role are able to use the `$settings` command\n**Inherits From:** `Server Moderator`\n**Setup Command:** `$set edit adminrole <role-name>`\n**Default Role:** `TypicalBot Administrator`")
            .addField("» Server Owner [4]", "**Description:** Users with this role are immune to all moderation commands and have access to every command. Can only be obtained if the user is the owner of the server, OR has ownership transferred to them by the current owner.\n**Inherits From:** `Server Administrator`\n**Setup Command:** N/A\n**Default Role:** N/A")
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();
    }
};
