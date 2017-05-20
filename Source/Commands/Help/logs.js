const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "?logs",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        /*let embed = {
            "color": 0x00ADFF,
            "title": "Possible Logs",
            "url": this.client.config.urls.website,
            "description": `You can set your server full of logs! Including activity and moderation.\n\n[Click here for more information on settings.](${this.client.config.urls.settings})`,
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
                "icon_url": `${this.client.config.urls.website}/images/icon.png`
            }

        };*/
        let embed = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("Possible logs").setURL(this.client.config.urls.website)
        .setDescription(`You can set your server full of logs! Including activity and moderation.\n\n[Click here for more information on settings.](${this.client.config.urls.settings})`)
        .addField("**__Setting Up Activity Logs__**", "To set up activity logs, use the settings edit command for the logs setting. `$settings edit logs <#channel>`", false)
        .addField("**__Changing Join Logs__**", "**Enabled** By Default\n**Setting:** logs-join\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message", true)
        .addField("**__Changing Leave Logs__**", "**__Changing Leave Logs__**", "value": "**Enabled** By Default\n**Setting:** logs-leave\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message", true)
        .addField("**__Changing Ban Logs__**", "**__Changing Ban Logs__**", "value": "**Enabled** By Default\n**Setting:** logs-ban\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message", true)
        .addField("**__Changing Unban Logs__**", "**__Changing Unban Logs__**", "value": "**Disabled** By Default\n**Setting:** logs-unban\n**Options:**\n- 'disable'\n- 'default'\n- 'embed'\n- desired-message", true)
        .addField("**__Changing Nickname Logs__**", "**Disabled** By Default\n**Setting:** logs-nick\n**Options:**\n- 'disable'\n- 'enable'\n- 'default'\n- desired-message", true)
        .addField("**__Changing Invite Sent Logs__**", "**Disabled** By Default\n**Setting:** logs-invite\n**Options:**\n- 'disable'\n- 'enable'\n- 'default'\n- desired-message", true)
        .addField("**__Setting Up Moderation Logs__**", "To set up moderation logs, use the settings edit command for the modlogs setting. `$settings edit modlogs <#channel>`", false)
        
        .setFooter("TypicalBot Support", `${this.client.config.urls.website}/images/icon.png`)
        .setTimestamp();

        response.embed(embed);
    }
};
