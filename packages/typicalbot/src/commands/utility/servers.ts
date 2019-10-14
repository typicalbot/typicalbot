import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

const regex = /(\d+)/;
const guildNameRegex = /[^a-z0-9 '"\/[\]()-_!@#$%^&*]/gim;

export default class extends Command {
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage) {
        const args = regex.exec(message.content) || [];
        args.shift();
        const [number] = args;
        const page = parseInt(number, 10);
        const paged = this.client.helpers.pagify.execute(
            message,
            this.client.guilds
                .array()
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(
                    g =>
                        `${this.client.helpers.lengthen.shorten(
                            `${g.name.replace(guildNameRegex, '')}`,
                            30
                        )} : ${g.memberCount}`
                ),
            page
        );

        const CLUSTER = message.translate('servers:CLUSTER', {
            cluster: this.client.cluster,
            count: this.client.shardCount
        });
        if (!message.embedable)
            return message.reply(
                [CLUSTER, '```autohotkey', paged, '```'].join('\n')
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(CLUSTER)
                .setDescription(['```autohotkey', paged, '```'].join('\n'))
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
