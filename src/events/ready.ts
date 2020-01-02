import Event from '../structures/Event';
import { ClientUser } from 'discord.js';
import { TypicalGuild } from '../extensions/TypicalGuild';

export default class Ready extends Event {
    once = true;

    async execute() {
        console.log(`Client Connected | Cluster ${this.client.cluster}`);
        (this.client.user as ClientUser).setActivity('Client is loading');

        setTimeout(
            () =>
                (this.client
                    .user as ClientUser).setActivity(
                    `${this.client.config.prefix}help — typicalbot.com`,
                    { type: 'WATCHING' }
                ),
            1000 * 60 * 5
        );

        setInterval(() => {
            this.client.voice &&
                this.client.voice.connections
                    .filter(c => c.channel.members.size === 1)
                    .forEach(c =>
                        (c.voice.guild as TypicalGuild).guildStream
                            ? (c.voice.guild as TypicalGuild).guildStream.end()
                            : c.disconnect()
                    );
        }, 1000 * 30);
    }
}
