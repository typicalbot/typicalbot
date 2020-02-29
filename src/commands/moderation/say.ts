import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { TextChannel, MessageEmbed } from 'discord.js';

const regex = /(?:(-j(?:son)?)\s+)?(?:<#(\d+)>\s+)?((?:.|[\r\n])+)?/i;

export default class extends Command {
    aliases = ['speak'];
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
        args.shift();

        const [json, channelID, content] = args;
        const channel = (message.guild.channels.cache.get(channelID) ||
            message.channel) as TextChannel;

        if (!!json) {
            try {
                const jsonParse = JSON.parse(content);

                channel
                    .send('', jsonParse)
                    .catch(() =>
                        message.error(
                            message.translate('moderation/say:MISSING_SEND')
                        )
                    );
            } catch (err) {
                message.error(message.translate('moderation/say:INVALID'));
            }
        } else {
            channel
                .send(content, { disableMentions: 'everyone' })
                .catch(() =>
                    message.error(
                        message.translate('moderation/say:MISSING_SEND')
                    )
                );
        }

        const { settings } = message.guild;
        const logChannel =
            settings.logs.id &&
            message.guild.channels.cache.get(settings.logs.id);
        if (
            logChannel &&
            logChannel instanceof TextChannel &&
            settings.logs.say
        ) {
            if (settings.logs.say === '--embed') {
                logChannel
                    .send(
                        new MessageEmbed()
                            .setColor(0xff33cc)
                            .setAuthor(
                                `${message.author.tag} (${message.author.id})`,
                                message.author.displayAvatarURL()
                            )
                            .addFields([
                                {
                                    name: message.translate('common:CHANNEL'),
                                    value: channel
                                }
                            ])
                            .setDescription(content)
                            .setFooter(message.translate('moderation/say:SENT'))
                            .setTimestamp()
                    )
                    .catch(() => null);
            } else if (logChannel && logChannel instanceof TextChannel) {
                logChannel
                    .send(
                        [
                            message.translate('moderation/say:TEXT', {
                                user: message.author.tag,
                                channel
                            }),
                            '```',
                            content,
                            '```'
                        ].join('\n')
                    )
                    .catch(() => null);
            }
        }

        if (message.deletable) message.delete({ timeout: 500 });

        return null;
    }
}
