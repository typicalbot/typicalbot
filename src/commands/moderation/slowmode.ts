import Command from '../../lib/structures/Command';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const cooldown = +parameters;

        if (!isFinite(cooldown) || cooldown > 21600) {
            return message.error(message.translate('moderation/slowmode:ERROR'));
        }

        const channel = message.channel as TextChannel;
        await channel.setRateLimitPerUser(cooldown);

        cooldown === 0
            ? await message.send(message.translate('moderation/slowmode:RESET'))
            : await message.send(message.translate('moderation/slowmode:SET', { cooldown }));

        const { settings } = message.guild;
        const logChannel = settings.logs.id && message.guild.channels.cache.get(`${BigInt(settings.logs.id)}`);

        if (logChannel && logChannel instanceof TextChannel && settings.logs.slowmode) {
            if (settings.logs.slowmode === '--embed') {
                logChannel
                    .send(new MessageEmbed()
                        .setColor(0xff33cc)
                        .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                        .addFields([
                            {
                                name: message.translate('common:CHANNEL'),
                                value: channel.id,
                            },
                            {
                                name: message.translate('moderation/slowmode:SLOWMODE'),
                                value: message.translate('moderation/slowmode:LOG_EMBED', { cooldown })
                            }
                        ])
                        .setTimestamp())
                    .catch(() => null);
            } else if (settings.logs.slowmode !== '--disabled') {
                logChannel
                    .send(message.translate('moderation/slowmode:LOG_TEXT', {
                        user: message.author.tag,
                        channel,
                        cooldown
                    })).catch(() => null);
            }
        }
    }
}
