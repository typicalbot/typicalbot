const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive a list of TypicalBot's commands.",
            usage: 'commands',
            aliases: ['cmds'],
            dm: true,
            mode: Constants.Modes.STRICT,
        });
    }

    execute(message) {
        if (message.channel.type === 'text') message.reply('A list of commands should have arrived in your Direct Messages.');

        const list = Array.from(this.client.commands.keys());

        const level4 = list.filter((c) => this.client.commands.get(c).permission === 4).map((c) => `${process.env.PREFIX}${c}`);
        const level3 = list.filter((c) => this.client.commands.get(c).permission === 3).map((c) => `${process.env.PREFIX}${c}`);
        const level2 = list.filter((c) => this.client.commands.get(c).permission === 2).map((c) => `${process.env.PREFIX}${c}`);
        const level1 = list.filter((c) => this.client.commands.get(c).permission === 1).map((c) => `${process.env.PREFIX}${c}`);
        const level0 = list.filter((c) => this.client.commands.get(c).permission === 0).map((c) => `${process.env.PREFIX}${c}`);

        message.author.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle('TypicalBot Commands')
            .setDescription(`Use \`${process.env.PREFIX}help <command>\` to get more information on a specific command.`)
            .addField('» Server Owner (Level 4)', level4.length ? level4.join(', ') : 'No commands to display.')
            .addField('» Server Administrator (Level 3)', level3.length ? level3.join(', ') : 'No commands to display.')
            .addField('» Server Moderator (Level 2)', level2.length ? level2.join(', ') : 'No commands to display.')
            .addField('» Server DJ (Level 1)', level1.length ? level1.join(', ') : 'No commands to display.')
            .addField('» Server Member (Level 0)', level0.length ? level0.join(', ') : 'No commands to display.')
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
