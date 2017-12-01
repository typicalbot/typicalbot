const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get a list of servers of the current shard.",
            usage: "servers [page]",
            mode: "strict"
        });
    }

    execute(message, parameters, permissionLevel) {
        const page = message.content.split(" ")[1];

        const lengthen = this.client.functions.lengthen;

        const paged = this.client.functions.pagify(this.client.guilds.sort((a,b) => b.memberCount - a.memberCount).map(g => `${lengthen(1, `${g.name.replace(/[^a-z0-9 '"/\\\[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`), page);

        return message.reply(
            `**__Servers on shard ${this.client.shardNumber} / ${this.client.shardCount}:__**\n\`\`\`autohotkey\n${paged}\`\`\``
        );
    }

    embedExecute(message, response){
        const page = message.content.split(" ")[1];

        const lengthen = this.client.functions.lengthen;

        const paged = this.client.functions.pagify(this.client.guilds.sort((a,b) => b.memberCount - a.memberCount).map(g => `${lengthen(1, `${g.name.replace(/[^a-z0-9 '"/\\\[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`), page);

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle(`Servers on Shard ${this.client.shardNumber} / ${this.client.shardCount}`)
            .setDescription(`\`\`\`autohotkey\n${paged}\`\`\``)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();
    }
};
