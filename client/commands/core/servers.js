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
        const args = /(\d+)/.exec(message.content);

        const paged = this.client.functions.pagify(
            this.client.guilds
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(g => `${this.client.functions.lengthen(1, `${g.name.replace(/[^a-z0-9 '"\/[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`),
            args ? args[1] : 1
        );

        return message.reply(`**__Servers on Cluster ${this.client.cluster} / ${this.client.shardCount}:__**\n\`\`\`autohotkey\n${paged}\`\`\``);
    }

    embedExecute(message, parameters, permissionLevel) {
        const args = /(\d+)/.exec(message.content);

        const paged = this.client.functions.pagify(
            this.client.guilds
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(g => `${this.client.functions.lengthen(1, `${g.name.replace(/[^a-z0-9 '"\/[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`),
            args ? args[1] : 1
        );

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle(`Servers on Cluster ${this.client.cluster} / ${this.client.shardCount}`)
            .setDescription(`\`\`\`autohotkey\n${paged}\`\`\``)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
