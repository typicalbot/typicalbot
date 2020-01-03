import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { TextChannel, MessageEmbed } from 'discord.js';

const regex = /(?:(-e)\s+)?((?:.|[\r\n])+)/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters?: string) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        });
        if (!parameters) return message.error(usageError);

        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('moderation/announce:INVALID')
            );
        args.shift();

        const [embed, content] = args;

        const channelID = message.guild.settings.announcements.id;
        if (!channelID)
            return message.error(
                message.translate('moderation/announce:INVALID_CHANNEL')
            );

        const channel = message.guild.channels.get(channelID) as
            | TextChannel
            | undefined;
        if (!channel || channel.type !== 'text')
            return message.error(
                message.translate('moderation/announce:INVALID_CHANNEL')
            );

        const roleID = message.guild.settings.announcements.mention;
        const mentionRole = roleID ? message.guild.roles.get(roleID) : null;

        if (!embed) {
            return channel.send(
                `${message.translate('moderation/announce:TEXT', {
                    usertag: message.author.tag,
                    role: mentionRole ? mentionRole.toString() : ''
                })}\n\n${content}`,
                { disableEveryone: false }
            );
        }

        return channel.send(mentionRole ? mentionRole.toString() : '', {
            embed: new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('moderation/announce:TITLE'))
                .setDescription(content)
                .setFooter(
                    message.author.tag,
                    message.author.displayAvatarURL()
                ),
            disableEveryone: false
        });
    }
}
