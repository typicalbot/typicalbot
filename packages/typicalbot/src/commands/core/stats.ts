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
            'guilds.size',
            'voice.connections.size',
            'channels.size',
            'users.size',
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
            .replace(/[\[\]]/g, '')
            .split(',')
            .join(', ');

        const uptime = this.client.helpers.convertTime.execute(
            message,
            this.client.uptime || 0
        );
        if (!message.embedable)
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
                        currentGuilds: this.client.guilds.size.toLocaleString(),
                        currentVoiceConnections:
                            this.client.voice &&
                            this.client.voice.connections.size.toLocaleString(),
                        currentChannels: this.client.channels.size
                            .toLocaleString()
                            .toLocaleString(),
                        currentUsers: this.client.users.size.toLocaleString(),
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
            .addField(message.translate('core/stats:UPTIME'), uptime, true)
            .addField(
                message.translate('core/stats:SERVERS'),
                message.translate('core/stats:SERVERS_VALUE', {
                    guilds: guilds.toLocaleString(),
                    count: this.client.shardCount
                }),
                true
            )
            .addField(
                message.translate('core/stats:VOICE'),
                voiceConnections.toLocaleString(),
                true
            )
            .addField(
                message.translate('core/stats:CHANNELS'),
                channels.toLocaleString(),
                true
            )
            .addField(
                message.translate('core/stats:USERS'),
                users.toLocaleString(),
                true
            )
            .addField(
                message.translate('core/stats:CPU'),
                `${Math.round(loadavg()[0] * 10000) / 100}%`,
                true
            )
            .addField(message.translate('core/stats:RAM'), `${usedRAM}MB`, true)
            .addField(
                message.translate('core/stats:RAM_TOTAL'),
                `${totalRAM}MB`,
                true
            )
            .addField(
                message.translate('core/stats:LIBRARY'),
                'discord.js',
                true
            )
            .addField(
                message.translate('core/stats:CREATED_BY'),
                'HyperCoder#2975\nnsylke#4490',
                true
            )
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp();

        if (this.client.config.clustered)
            embed
                .addBlankField()
                .addField('» Cluster', `${clusterName}\n${clusterShards}`, true)
                .addField(
                    message.translate('core/stats:SERVERS'),
                    this.client.guilds.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('core/stats:VOICE'),
                    this.client.voice &&
                        this.client.voice.connections.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('core/stats:CHANNELS'),
                    this.client.channels.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('core/stats:USERS'),
                    this.client.users.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('core/stats:RAM'),
                    `${this.client.usedRAM}MB`,
                    true
                )
                .addField(
                    message.translate('core/stats:RAM_TOTAL'),
                    `${this.client.totalRAM}MB`,
                    true
                );

        return message.send(embed);
    }
}
