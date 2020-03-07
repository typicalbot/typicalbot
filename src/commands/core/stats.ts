import { MessageEmbed } from 'discord.js';
import { loadavg } from 'os';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalMessage) {
        const paths = [
            'guilds.cache.size',
            'voice.connections.size',
            'channels.cache.size',
            'users.cache.size',
            'usedRAM',
            'totalRAM'
        ];
        const [
            guilds,
            voiceConnections,
            channels,
            users,
            usedRAM,
            totalRAM
        ] = await Promise.all(paths.map(path => this.client.fetchData(path)));

        const clusterParts = this.client.cluster.match(
            /^(\S+? \S+?) ([\s\S]+?)$/
        ) as RegExpMatchArray;
        const clusterName = clusterParts[1];
        const clusterShards = clusterParts[2]
            .replace(/[\\[\]]/g, '')
            .split(',')
            .join(', ');

        const uptime = this.client.helpers.convertTime.execute(
            message,
            this.client.uptime || 0
        );
        if (!message.embeddable)
            return message.send(
                message.translate(
                    this.client.config.clustered
                        ? 'core/stats:CLUSTERED_TEXT'
                        : 'core/stats:TEXT',
                    {
                        uptime,
                        guilds: guilds.toLocaleString(),
                        count: this.client.shardCount,
                        voiceConnections: voiceConnections.toLocaleString(),
                        channels: channels.toLocaleString(),
                        users: users.toLocaleString(),
                        cpu: Math.round(loadavg()[0] * 10000) / 100,
                        usedRAM,
                        totalRAM,
                        clusterName,
                        clusterShards,
                        currentGuilds: this.client.guilds.cache.size.toLocaleString(),
                        currentVoiceConnections:
                            this.client.voice &&
                            this.client.voice.connections.size.toLocaleString(),
                        currentChannels: this.client.channels.cache.size
                            .toLocaleString()
                            .toLocaleString(),
                        currentUsers: this.client.users.cache.size.toLocaleString(),
                        ram:
                            Math.round(
                                100 * (process.memoryUsage().heapUsed / 1048576)
                            ) / 100,
                        ramTotal:
                            Math.round(
                                100 *
                                    (process.memoryUsage().heapTotal / 1048576)
                            ) / 100
                    }
                )
            );

        const embed = new MessageEmbed()
            .setColor(0x00adff)
            .setThumbnail(Constants.Links.ICON)
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
                    name: message.translate('core/stats:VOICE'),
                    value: voiceConnections.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:CHANNELS'),
                    value: channels.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:USERS'),
                    value: users.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:CPU'),
                    value: `${Math.round(loadavg()[0] * 10000) / 100}%`,
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
                },
                {
                    name: message.translate('core/stats:LIBRARY'),
                    value: 'discord.js',
                    inline: true
                },
                {
                    name: message.translate('core/stats:CREATED_BY'),
                    value: 'nsylke#4490',
                    inline: true
                }
            ])
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp();

        if (this.client.config.clustered)
            embed.addFields([
                {
                    name: '» Cluster',
                    value: `${clusterName}\n${clusterShards}`,
                    inline: true
                },
                {
                    name: message.translate('core/stats:SERVERS'),
                    value: this.client.guilds.cache.size.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:VOICE'),
                    value:
                        this.client.voice &&
                        this.client.voice.connections.size.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:CHANNELS'),
                    value: this.client.channels.cache.size.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:USERS'),
                    value: this.client.users.cache.size.toLocaleString(),
                    inline: true
                },
                {
                    name: message.translate('core/stats:RAM'),
                    value: `${this.client.usedRAM}MB`,
                    inline: true
                },
                {
                    name: message.translate('core/stats:RAM_TOTAL'),
                    value: `${this.client.totalRAM}MB`,
                    inline: true
                }
            ]);

        return message.send(embed);
    }
}
