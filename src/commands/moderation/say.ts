import { TextChannel, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

const regex = /(?:(-j(?:son)?)\s+)?(?:<#(\d+)>\s+)?((?:.|[\r\n])+)?/i;

export default class extends Command {
    aliases = ['speak'];
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        const [json, channelID, content] = args;
        const channel = (message.guild.channels.cache.get(`${BigInt(channelID)}`) ??
            message.channel) as TextChannel;

        if (json) {
            try {
                channel
                    .send('This method is no longer supported')
                    .catch(() =>
                        message.error(message.translate('moderation/say:MISSING_SEND')));
            } catch (err) {
                await message.error(message.translate('moderation/say:INVALID'));
            }
        } else {
            channel
                .send({ content, allowedMentions: { parse: [] } })
                .catch(() =>
                    message.error(message.translate('moderation/say:MISSING_SEND')));
        }

        const { settings } = message.guild;
        const logChannel =
            settings.logs.id &&
            message.guild.channels.cache.get(`${BigInt(settings.logs.id)}`);
        if (
            logChannel &&
            logChannel instanceof TextChannel &&
            settings.logs.say
        ) {
            if (settings.logs.say === '--embed') {
                logChannel
                    .send({ embeds:[new MessageEmbed()
                        .setColor(0xff33cc)
                        .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                        .addFields([
                            {
                                name: message.translate('common:CHANNEL'),
                                value: channel.id
                            }
                        ])
                        .setDescription(content)
                        .setFooter(message.translate('moderation/say:SENT'))
                        .setTimestamp()] })
                    .catch(() => null);
            } else if (logChannel) {
                logChannel
                    .send({ content: [
                        message.translate('moderation/say:TEXT', {
                            user: message.author.tag,
                            channel
                        }),
                        '```',
                        content,
                        '```'
                    ].join('\n'), allowedMentions: { parse: [] } })
                    .catch(() => null);
            }
        }

        if (message.deletable) await message.delete();

        return null;
    }
}
