const pm2 = require('pm2');
const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'A command to restart the bot or a cluster.',
            usage: 'restart <cluster-name>',
            permission: Constants.Permissions.Levels.TYPICALBOT_MAINTAINER,
            mode: Constants.Modes.STRICT,
        });
    }

    execute(message, parameters) {
        let processes;

        if (!parameters || parameters === 'all') {
            const list = [];

            for (let i = 1; i <= Number(process.env.CLUSTER_COUNT); i++) {
                list.push(`${process.env.CLUSTER_NAME}-${process.env.CLUSTER_BUILD ? `${process.env.CLUSTER_BUILD}-` : ''}${i}`);
            }

            processes = list.join(' ');
        } else processes = parameters;

        pm2.connect((err) => {
            if (err) console.error(err);

            pm2.restart(processes, (err, apps) => {
                if (err && err.message.includes('process name not found')) return message.error('Process not found.');
                if (err) {
                    message.error('An error occured while trying to restart, check the console.');
                    console.error(err);
                } else message.success('Restarted process.');

                pm2.disconnect();
            });
        });
    }
};
