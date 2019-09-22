const { exec } = require('child_process');
const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'A command to update and restart the bot.',
            usage: 'update',
            permission: Constants.Permissions.Levels.TYPICALBOT_MAINTAINER,
            mode: Constants.Modes.STRICT,
        });
    }

    execute(message) {
        const path = process.cwd();

        exec('git pull', { cwd: path }, (err, stdout, stderr) => {
            if (err) return console.error(err);

            const embed = message.buildEmbed().setTitle('TypicalBot Updater').setFooter('TypicalBot', Constants.Links.ICON).setColor(0x00adff);

            if (stdout) embed.addField('» STDOUT', stdout.toString().substring(0, 1024));
            if (stderr) embed.addField('» STDERR', stderr.toString().substring(0, 1024));

            embed.send();
        });
    }
};
