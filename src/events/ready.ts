import Event from '../structures/Event';
import { ClientUser } from 'discord.js';

export default class Ready extends Event {
    once = true;

    async execute() {
        this.client.logger.info(`Client Connected | Cluster ${this.client.cluster}`);
        await (this.client.user as ClientUser).setActivity('Client is loading');

        if (this.client.config.apis.amplitude) {
            setInterval(async () => {
                for (let i = 0; i < 100; i++) {
                    if (this.client.amplitude.getEvents().length >= 10) return;

                    await this.client.amplitude.publish();
                }
            }, 1000);
        }

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
