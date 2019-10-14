import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        if (parameters === 'view') {
            return message.dm(
                message.guild.settings.apikey
                    ? message.translate('api:KEY', {
                          guild: message.guild.name,
                          key: message.guild.settings.apikey
                      })
                    : message.translate('api:NONE')
            );
        }

        if (parameters === 'generate') {
            const newApiKey = `${Buffer.from(
                message.guild.id.toString()
            ).toString('base64')}.${Buffer.from(Date.now().toString()).toString(
                'base64'
            )}`;

            this.client.settings
                .update(message.guild.id, {
                    apikey: newApiKey
                })
                .then(() => message.success(message.translate('api:SUCCESS')));

            return message.dm(
                message.translate('api:KEY', {
                    guild: message.guild.name,
                    key: newApiKey
                })
            );
        }
        return message.error(message.translate('common:INVALID_OPTION'));
    }
}
