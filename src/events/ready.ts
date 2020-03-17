import Event from '../structures/Event';
import { ClientUser } from 'discord.js';

export default class Ready extends Event {
    once = true;

    async execute() {
        this.client.logger.info(`Client Connected | Cluster ${this.client.cluster}`);
        await (this.client.user as ClientUser).setActivity('Client is loading');

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
