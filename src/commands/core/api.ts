import { Modes, PermissionsLevels } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    permission = PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        if (parameters === 'view') {
            return message.dm(message.guild.settings.apikey
                ? message.translate('core/api:KEY', {
                    guild: message.guild.name,
                    key: message.guild.settings.apikey
                })
                : message.translate('core/api:NONE'));
        }

        if (parameters === 'generate') {
            const newApiKey = `${Buffer.from(message.guild.id.toString()).toString('base64')}.${Buffer.from(Date.now().toString()).toString('base64')}`;

            this.client.settings
                .update(message.guild.id, {
                    apikey: newApiKey
                })
                .then(() =>
                    message.success(message.translate('core/api:SUCCESS')));

            return message.dm(message.translate('core/api:KEY', {
                guild: message.guild.name,
                key: newApiKey
            }));
        }
        return message.error(message.translate('common:INVALID_OPTION'));
    }
}
