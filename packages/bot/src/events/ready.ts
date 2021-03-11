import { Team } from 'discord.js';
import Event from '../lib/structures/Event';

export default class Ready extends Event {
    once = true;

    async execute() {
        this.client.logger.info(`Client Connected | Cluster ${this.client.cluster}`);

        this.client.fetchApplication()
            .then((application) => {
                if (application.owner instanceof Team) {
                    application.owner.members.forEach((m) => this.client.owners.push(m.id));
                } else {
                    if (application.owner) {
                        this.client.owners.push(application.owner.id);
                    }
                }
            }).catch(() => this.client.logger.debug('Failed to load owners from application'));

        setInterval(async () => {
            for (let i = 0; i < 50; i++) {
                if (!this.client.analytics.getEvents().length) break;

                await this.client.analytics.publish();
            }
        }, 1000);
    }
}
