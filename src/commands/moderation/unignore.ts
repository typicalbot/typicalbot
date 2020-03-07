import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(commands|invites|stars)/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
        args.shift();
        const [type] = args;
        const commands = type === 'commands';
        const invites = type === 'invites';
        const stars = type === 'stars';

        if (
            commands &&
            !message.guild.settings.ignored.commands.includes(
                message.channel.id
            )
        )
            return message.error(
                message.translate('moderation/unignore:COMMANDS')
            );
        if (
            invites &&
            !message.guild.settings.ignored.invites.includes(message.channel.id)
        )
            return message.error(
                message.translate('moderation/unignore:INVITES')
            );
        if (
            stars &&
            !message.guild.settings.ignored.stars.includes(message.channel.id)
        ) {
            if (!message.guild.settings.starboard.id)
                return message.error(
                    message.translate('moderation/unignore:DISABLED')
                );
            return message.error(
                message.translate('moderation/unignore:STARBOARD')
            );
        }

        const ignoredIDs = message.guild.settings.ignored;

        const channelIDs = commands
            ? ignoredIDs.commands
            : invites
                ? ignoredIDs.invites
                : ignoredIDs.stars;

        channelIDs.splice(channelIDs.indexOf(message.channel.id), 1);

        const ignored = await this.client.settings
            .update(message.guild.id, {
                ignored: {
                    ...message.guild.settings.ignored,
                    [type]: channelIDs
                }
            })
            .catch(() => null);

        if (ignored)
            return message.success(
                message.translate('moderation/unignore:SUCCESS', { type })
            );

        return null;
    }
}
