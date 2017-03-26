module.exports = {
    "?perms": {
        mode: "strict",
        permission: 0,
        execute: (message, client, response) => {
            let embed = {
                "color": 0x00ADFF,
                "title": "Permission Levels",
                "url": client.config.urls.website,
                "description": "There's three possible permissions to get. These include...",
                "fields": [
                    { "name": "**__Permission Level 0: Server Member__**", "value": "This is the default permission level given to all members of a server. This level has all basic commands." },
                    { "name": "**__Permission Level 1: Server DJ__**", "value": "The level for people who can music commands that are set to DJ+." },
                    { "name": "**__Permission Level 2: Server Moderator__**", "value": "The level for people who can do basic moderation things such as kicks and warnings." },
                    { "name": "**__Permission Level 3: Server Administrator__**", "value": "This is the level for the powerful people. All moderation commands can be used by this level. Settings can be changed by these members." },
                    { "name": "**__Permission Level 4: Server Owner__**", "value": "The mighty server owner. All commands are applied to the owner and he can do as he or she wishes." },
                    { "name": "**__Assigning Permission Level 1__**", "value": "**__CURRENTLY DISABLED.__** By default, anyone with the role `TypicalBot DJ` will get this permission. You can set it with `$set edit djrole <role-name>` to change it." },
                    { "name": "**__Assigning Permission Level 2__**", "value": "By default, anyone with the role `TypicalBot Mod` will get this permission. You can set it with `$set edit modrole <role-name>` to change it." },
                    { "name": "**__Assigning Permission Level 3__**", "value": "By default, anyone with the role `TypicalBot Admin` will get this permission. You can set it with `$set edit masterrole <role-name>` to change it." },
                    { "name": "**__Assigning Permission Level 4__**", "value": "It is impossible to assign this permission level, unless giving up ownership of the server. Only one person can have this permission level." },
                ],
                "timestamp": new Date(),
                "footer": {
                    "text": `TypicalBot Support`,
                    "icon_url": "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg"
                }
            };

            response.send("", embed);
        }
    },
    "?logs": {
        mode: "strict",
        permission: 0,
        execute: (message, client, response) => {
            let embed = {
                "color": 0x00ADFF,
                "title": "Possible Logs",
                "url": client.config.urls.website,
                "description": "You can set your server full of logs! Including activity and moderation.\n\n[More Information on Settings](https://typicalbot.com/documentation/#&settings)",
                "fields": [
                    { "name": "**__Setting Up Activity Logs__**", "value": "To set up activity logs, use the settings edit command for the logs setting. `$settings edit logs <#channel>`" },
                    { "inline": true, "name": "**__Changing Join Logs__**", "value": "**Enabled** By Default\n**Setting:** logs-join\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message" },
                    { "inline": true, "name": "**__Changing Leave Logs__**", "value": "**Enabled** By Default\n**Setting:** logs-leave\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message" },
                    { "inline": true, "name": "**__Changing Ban Logs__**", "value": "**Enabled** By Default\n**Setting:** logs-ban\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message" },
                    { "inline": true, "name": "**__Changing Unban Logs__**", "value": "**Disabled** By Default\n**Setting:** logs-unban\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message" },
                    { "inline": true, "name": "**__Changing Nickname Logs__**", "value": "**Disabled** By Default\n**Setting:** logs-nick\n**Options:**\n- 'disable'\n- 'enable'\n- 'default'\n- desired-message" },
                    { "inline": true, "name": "**__Changing Invite Sent Logs__**", "value": "**Disabled** By Default\n**Setting:** logs-invite\n**Options:**\n- 'disable'\n- 'enable'\n- 'default'\n- desired-message" },
                    { "name": "**__Setting Up Moderation Logs__**", "value": "To set up moderation logs, use the settings edit command for the modlogs setting. `$settings edit modlogs <#channel>`" },
                ],
                "timestamp": new Date(),
                "footer": {
                    "text": `TypicalBot Support`,
                    "icon_url": "https://discordapp.com/api/v6/users/153613756348366849/avatars/f23270abe4a489eef6c2c372704fbe72.jpg"
                }
            };

            response.send("", embed);
        }
    }
};
