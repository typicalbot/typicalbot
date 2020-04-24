import { Modes, PermissionsLevels } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    permission = PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = /(commands|invites|stars|view)/i.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));
        args.shift();

        const [subcommand] = args;
        const { commands, invites, stars } = message.guild.settings.ignored;

        switch (subcommand) {
            case 'view':
                return this.view(message);
            case 'commands':
                if (commands.includes(message.channel.id))
                    return message.error(message.translate('moderation/ignore:ALREADY_IGNORING', {
                        type: message
                            .translate('common:COMMANDS')
                            .toLowerCase()
                    }));
                return this.addIgnore(message, commands, 'common:COMMANDS', 'commands');
            case 'invites':
                if (invites.includes(message.channel.id))
                    return message.error(message.translate('moderation/ignore:ALREADY_IGNORING', {
                        type: message
                            .translate('common:INVITES')
                            .toLowerCase()
                    }));

                return this.addIgnore(message, invites, 'common:INVITES', 'invites');
            case 'stars':
                if (!message.guild.settings.starboard.id)
                    return message.error(message.translate('moderation/ignore:STARBOARD'));

                return this.addIgnore(message, stars, 'common:STARS', 'stars');
        }

        return null;
    }

    async addIgnore(message: TypicalGuildMessage,
        array: string[],
        typeKey: string,
        key: string) {
        if (array.includes(message.channel.id))
            return message.error(message.translate('moderation/ignore:ALREADY_IGNORING', {
                type: message.translate(typeKey).toLowerCase()
            }));

        array.push(message.channel.id);

        return this.client.settings
            .update(message.guild.id, {
                ignored: { ...message.guild.settings.ignored, [key]: array }
            })
            .then(() =>
                message.success(message.translate('moderation/ignore:ADDED', { type: key })));
    }

    view(message: TypicalGuildMessage) {
        const { commands, invites, stars } = message.guild.settings.ignored;

        const NA = message.translate('common:NA');
        const response = [
            message.translate('moderation/ignore:IGNORING', {
                type: message.translate('common:COMMANDS')
            }),
            commands.length ? commands.map((id) => `<#${id}>`) : NA,
            '',
            message.translate('moderation/ignore:IGNORING', {
                type: message.translate('common:INVITES')
            }),
            invites.length ? invites.map((id) => `<#${id}>`) : NA,
            '',
            message.translate('moderation/ignore:IGNORING', {
                type: message.translate('common:STARS')
            }),
            stars.length ? stars.map((id) => `<#${id}>`) : NA
        ];

        return message.send(response.join('\n'));
    }
}
