import Handler from '../lib/handler/Handler';
import { Team } from 'discord.js';

const StartupHandler: Handler<'ready'> = async (client) => {
    client.logger.info(`Client Connected | Cluster ${process.env.CLUSTER} [${client.shards.join(', ')}]`);

    client.id ??= client.user?.id ?? null;

    client.application?.fetch()
        .then((application) => {
            if (application.owner instanceof Team) {
                application.owner.members.forEach((m) => client.owners.push(m.id));
            } else {
                if (application.owner) {
                    client.owners.push(application.owner.id);
                }
            }
        }).catch(() => client.logger.debug('Failed to load owners from application'));
};

export default StartupHandler;
