const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "?perms",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        /*response.buildEmbed()
            .setColor(0x00adff)
            .setTitle("Permission Levels").setURL(this.client.config.urls.website)
            .setDescription(`There's three possible permissions to get. These include...\n\n[Click here for more information on settings.](${this.client.config.urls.settings})`)
            .addField("**__Permission Level -1: Blacklisted__**", "This is the level that prevents the users from using any TypicalBot commands.",true)
            .addField("**__Permission Level 0: Server Member__**", "This is the default permission level given to all members of a server. This level has all basic commands.", true)
            .addField("**__Permission Level 1: Server DJ__**", "The level for people who can music commands that are set to DJ+.", true)
            .addField("**__Permission Level 2: Server Moderator__**", "The level for people who can do basic moderation things such as kicks and warnings.", true)
            .addField("**__Permission Level 3: Server Administrator__**", "This is the level for the powerful people. All moderation commands can be used by this level. Settings can be changed by these members.", true)
            .addField("**__Permission Level 4: Server Owner__**", "The mighty server owner. All commands are applied to the owner and they can do as they wish.", true)
            .addField("**__Assigning Permission Level -1__**", "You can set this permission level with `$set edit blacklistrole <role-name>` in order to change it.", true)
            .addField("**__Assigning Permission Level 1__**", "**__CURRENTLY DISABLED.__** By default, anyone with the role `TypicalBot DJ` will get this permission. You can set it with `$set edit djrole <role-name>` to change it.", true)
            .addField("**__Assigning Permission Level 2__**", "By default, anyone with the role `TypicalBot Mod` will get this permission. You can set it with `$set edit modrole <role-name>` to change it.", true)
            .addField("**__Assigning Permission Level 3__**", "By default, anyone with the role `TypicalBot Admin` will get this permission. You can set it with `$set edit masterrole <role-name>` to change it.", true)
            .addField("**__Assigning Permission Level 4__**", "It is impossible to assign this permission level, unless giving up ownership of the server. Only one person can have this permission level.", true)
            .setFooter("TypicalBot Support", `${this.client.config.urls.website}/images/icon.png`)
            .setTimestamp()
            .send();*/
        response.buildEmbed()
            .setColor(0x00adff)
            .setTitle("Permission Levels").setURL(this.client.config.urls.website)
            .setDescription(`There are six possible permission levels to have. Commands for all levels can be seen with \`d$commands\`.`)
            .addField("» Blacklisted [-1]", "**Description:** Users with this role are unable to use the bot.\n**Inherits From:** N/A\n**Setup Command:** `$set edit blacklistrole <role-name>`\n**Default Role:** `TypicalBot Blacklisted`")
            .addField("» Server Member [0]", "**Description:** Users with this role are able to use the default commands in the bot.\n**Inherits From:** N/A\n**Setup Command:** N/A\n**Default Role:** N/A")
            .addField("» Server DJ [1]", "**Description:** Users with this role are able to use DJ-only music commands.\n**Inherits From:** `Server Member`\n**Setup Command:** `$set edit djrole <role-name>`\n**Default Role:** N/A")
            .addField("» Server Moderator [2]", "**Description:** Users with this role are able to use moderation commands.\n**Inherits From:** `Server DJ`\n**Setup Command:** `$set edit modrole <role-name>`\n**Default Role:** `TypicalBot Moderator`")
            .addField("» Server Administator [3]", "**Description:** Users with this role are able to use the `$settings` command\n**Inherits From:** `Server Moderator`\n**Setup Command:** `$set edit adminrole <role-name>`\n**Default Role:** `TypicalBot Administrator`")
            .addField("» Server Owner [4]", "**Description:** Users with this role are immune to all moderation commands and have access to every command. Can only be obtained if the user is the owner of the server, OR has ownership transfered to them by the current owner.\n**Inherits From:** `Server Administrator`\n**Setup Command:** N/A\n**Default Role:** N/A")
            .setFooter("TypicalBot Support", `${this.client.config.urls.website}/images/icon.png`)
            .setTimestamp()
            .send();
    }
};
