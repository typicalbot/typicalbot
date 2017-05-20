const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "?perms",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        /*let embed = {
            "color": 0x00ADFF,
            "title": "Permission Levels",
            "url": this.client.config.urls.website,
            "description": `There's three possible permissions to get. These include...\n\n[Click here for more information on settings.](${this.client.config.urls.settings})`,
            "fields": [
                { "name": "**__Permission Level 0: Server Member__**", "value": "This is the default permission level given to all members of a server. This level has all basic commands." },
                { "name": "**__Permission Level 1: Server DJ__**", "value": "The level for people who can music commands that are set to DJ+." },
                { "name": "**__Permission Level 2: Server Moderator__**", "value": "The level for people who can do basic moderation things such as kicks and warnings." },
                { "name": "**__Permission Level 3: Server Administrator__**", "value": "This is the level for the powerful people. All moderation commands can be used by this level. Settings can be changed by these members." },
                { "name": "**__Permission Level 4: Server Owner__**", "value": "The mighty server owner. All commands are applied to the owner and they can do as they wish." },
                { "name": "**__Assigning Permission Level 1__**", "value": "**__CURRENTLY DISABLED.__** By default, anyone with the role `TypicalBot DJ` will get this permission. You can set it with `$set edit djrole <role-name>` to change it." },
                { "name": "**__Assigning Permission Level 2__**", "value": "By default, anyone with the role `TypicalBot Mod` will get this permission. You can set it with `$set edit modrole <role-name>` to change it." },
                { "name": "**__Assigning Permission Level 3__**", "value": "By default, anyone with the role `TypicalBot Admin` will get this permission. You can set it with `$set edit masterrole <role-name>` to change it." },
                { "name": "**__Assigning Permission Level 4__**", "value": "It is impossible to assign this permission level, unless giving up ownership of the server. Only one person can have this permission level." },
            ],
            "timestamp": new Date(),
            "footer": {
                "text": `TypicalBot Support`,
                "icon_url": `${this.client.config.urls.website}/images/icon.png`
            }
        };*/
        
        let embed = new RichEmbed()
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
        .setTimestamp();


        response.embed(embed);
    }
};
