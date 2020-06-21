import { loadavg } from 'os';
import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes, Links } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    async execute(message: TypicalMessage) {
        const paths = [
            'guilds.cache.size',
            'users.cache.size',
            'usedRAM',
            'totalRAM'
        ];
        const [
            guilds,
            users,
            usedRAM,
            totalRAM
        ] = await Promise.all(paths.map((path) => this.client.fetchData(path)));

        const uptime = this.client.helpers.convertTime.execute(message, this.client.uptime ?? 0);
        if (!message.embeddable)
            return message.send(message.translate('core/stats:TEXT', {
                uptime,
                guilds: guilds.toLocaleString(),
                count: this.client.shardCount,
                users: users.toLocaleString(),
                cpu: Math.round(loadavg()[0] * 10000) / 100,
                usedRAM,
                totalRAM
            }));

        const embed = new MessageEmbed()
            .setColor(0x00adff)
            .setThumbnail(Links.ICON)
            .setTitle(message.translate('core/stats:TYPICAL_STATS'))
            .addFields([
                {
                    name: message.translate('core/stats:UPTIME'),
                    value: uptime,
                    inline: true
                },
                {
                    name: message.translate('core/stats:SERVERS'),
                    value: message.translate('core/stats:SERVERS_VALUE', {
                        guilds: guilds.toLocaleString(),
                        count: this.client.shardCount
                    }),
                    inline: true
                },
                {
                    name: message.translate('core/stats:USERS'),
                    value: users.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:CPU'),
                    value: `${loadavg().map((c) => Math.round(c * 10000) / 100).join('%, ')}%`,
                    inline: true
                },
                {
                    name: message.translate('core/stats:RAM'),
                    value: `${usedRAM}MB`,
                    inline: true
                },
                {
                    name: message.translate('core/stats:RAM_TOTAL'),
                    value: `${totalRAM}MB`,
                    inline: true
                }
            ])
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp();

        return message.send(embed);
    }
}
