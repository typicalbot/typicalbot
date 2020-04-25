import Event from '../lib/structures/Event';

export default class Ready extends Event {
    once = true;

    async execute() {
        this.client.logger.info(`Client Connected | Cluster ${this.client.cluster}`);

        setInterval(async () => {
            for (let i = 0; i < 50; i++) {
                if (!this.client.analytics.getEvents().length) break;

                await this.client.analytics.publish();
            }
        }, 1000);
    }
}
