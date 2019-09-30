import { Message, MessageEmbed } from 'discord.js';
import { loadavg } from 'os';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import TypicalFunction from '../../structures/Function';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    async execute(message: Message) {
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

        const convertTime = this.client.functions.get(
            'converTime'
        ) as TypicalFunction;
        const uptime = convertTime.execute(message, this.client.uptime);
        if (!message.embedable)
            return message.send(
                message.translate('stats:TEXT', {
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
                            100 * (process.memoryUsage().heapTotal / 1048576)
                        ) / 100
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setThumbnail(Constants.Links.ICON)
                .setTitle(message.translate('stats:TYPICAL_STATS'))
                .addField(message.translate('stats:UPTIME'), uptime, true)
                .addField(
                    message.translate('stats:SERVERS'),
                    message.translate('stats:SERVERS_VALUE', {
                        guilds: guilds.toLocaleString(),
                        count: this.client.shardCount
                    }),
                    true
                )
                .addField(
                    message.translate('stats:VOICE'),
                    voiceConnections.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:CHANNELS'),
                    channels.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:USERS'),
                    users.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:CPU'),
                    `${Math.round(loadavg()[0] * 10000) / 100}%`,
                    true
                )
                .addField(message.translate('stats:RAM'), `${usedRAM}MB`, true)
                .addField(
                    message.translate('stats:RAM_TOTAL'),
                    `${totalRAM}MB`,
                    true
                )
                .addField(
                    message.translate('stats:LIBRARY'),
                    'discord.js',
                    true
                )
                .addField(
                    message.translate('stats:CREATED_BY'),
                    'HyperCoder#2975\nnsylke#4490',
                    true
                )
                .addBlankField()
                .addField('» Cluster', `${clusterName}\n${clusterShards}`, true)
                .addField(
                    message.translate('stats:SERVERS'),
                    this.client.guilds.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:VOICE'),
                    this.client.voice &&
                        this.client.voice.connections.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:CHANNELS'),
                    this.client.channels.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:USERS'),
                    this.client.users.size.toLocaleString(),
                    true
                )
                .addField(
                    message.translate('stats:RAM'),
                    `${this.client.usedRAM}MB`,
                    true
                )
                .addField(
                    message.translate('stats:RAM_TOTAL'),
                    `${this.client.totalRAM}MB`,
                    true
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
