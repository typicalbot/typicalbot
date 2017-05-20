const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "servers",
            description: "Get a list of servers of the current shard.",
            usage: "servers [page]",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let page = message.content.split(" ")[1];

        let lengthen = this.client.functions.lengthen;

        let paged = this.client.functions.pagify(this.client.guilds.array().sort((a,b) => b.memberCount - a.memberCount).map(g => `${lengthen(`${g.name.replace(/[^a-z0-9 '"/\\\[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`), page);

        return response.reply(
            `**__Servers on shard ${this.client.shardNumber} / ${this.client.shardCount}:__**\n\`\`\`autohotkey\n${paged}\`\`\``
        );
    }

    embedExecute(message, response){
        let page = message.content.split(" ")[1];

        let lengthen = this.client.functions.lengthen;

        let paged = this.client.functions.pagify(this.client.guilds.array().sort((a,b) => b.memberCount - a.memberCount).map(g => `${lengthen(`${g.name.replace(/[^a-z0-9 '"/\\\[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`), page);

        let embed = new RichEmbed()
        .setColor(0x00adff)
        .setTitle(`Servers on Shard ${this.client.shardNumber} / ${this.client.shardCount}`)
        .setDescription(`\`\`\`autohotkey\n${paged}\`\`\``)
        .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
        .setTimestamp();

        return response.embed(embed);
    }
};
