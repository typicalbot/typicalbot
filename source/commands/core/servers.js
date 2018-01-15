/* eslint no-useless-escape: "off" */
const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get a list of servers of the current shard.",
            usage: "servers [page]",
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const paged = this.client.functions.pagify(
            this.client.guilds
                .sort((a,b) => b.memberCount - a.memberCount)
                .map(g => `${this.client.functions.lengthen(1, `${g.name.replace(/[^a-z0-9 '"\/[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`),
            parameters
        );

        return message.reply(`**__Servers on shard ${this.client.shardNumber} / ${this.client.shardCount}:__**\n\`\`\`autohotkey\n${paged}\`\`\``);
    }

    embedExecute(message, parameters, permissionLevel){
        const paged = this.client.functions.pagify(
            this.client.guilds
                .sort((a,b) => b.memberCount - a.memberCount)
                .map(g => `${this.client.functions.lengthen(1, `${g.name.replace(/[^a-z0-9 '"\/[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`),
            parameters
        );

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle(`Servers on Shard ${this.client.shardNumber} / ${this.client.shardCount}`)
            .setDescription(`\`\`\`autohotkey\n${paged}\`\`\``)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
