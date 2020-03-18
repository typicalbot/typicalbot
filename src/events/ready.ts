import Event from '../structures/Event';
import { ClientUser } from 'discord.js';

export default class Ready extends Event {
    once = true;

    async execute() {
        this.client.logger.info(`Client Connected | Cluster ${this.client.cluster}`);
        await (this.client.user as ClientUser).setActivity('Client is loading');

        setInterval(async () => {
            for (let i = 0; i < 50; i++) {
                if (!this.client.analytics.getEvents().length) break;

                await this.client.analytics.publish();
            }
        }, 1000);

        setTimeout(
            () =>
                (this.client
                    .user as ClientUser).setActivity(
                    `${this.client.config.prefix}help — typicalbot.com`,
                    { type: 'WATCHING' }
                ),
            1000 * 60 * 5
        );
    }
}
