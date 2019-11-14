import * as pm2 from 'pm2';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    permission = Constants.PermissionsLevels.TYPICALBOT_MAINTAINER;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        let processes: string;

        if (!parameters || parameters === 'all') {
            const list = [];

            for (let i = 1; i <= Number(process.env.CLUSTER_COUNT); i++) {
                list.push(
                    `${this.client.config.clusterServer}-${
                        this.client.config.clusterBuild
                            ? `${this.client.config.clusterBuild}-`
                            : ''
                    }${i}`
                );
            }

            processes = list.join(' ');
        } else processes = parameters;

        pm2.connect(err => {
            if (err) console.error(err);

            pm2.restart(processes, err => {
                if (err && err.message.includes('process name not found'))
                    return message.error('Process not found.');
                if (err) {
                    message.error(
                        'An error occured while trying to restart, check the console.'
                    );
                    console.error(err);
                } else message.success('Restarted process.');

                return pm2.disconnect();
            });
        });
    }
}
