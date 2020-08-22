import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;
    mode = MODE.STRICT;

    execute(message: TypicalGuildMessage, parameters: string) {
        if (parameters === 'view') {
            return message.dm(message.guild.settings.apikey
                ? message.translate('administration/api:KEY', {
                    guild: message.guild.name,
                    key: message.guild.settings.apikey
                })
                : message.translate('administration/api:NONE'));
        }

        if (parameters === 'generate') {
            const guildIdBase64 = Buffer.from(message.guild.id.toString()).toString('base64');
            const dateBase64 = Buffer.from(Date.now().toString()).toString('base64');

            const newApiKey = `${guildIdBase64}.${dateBase64}`;

            this.client.settings
                .update(message.guild.id, {
                    apikey: newApiKey
                })
                .then(() =>
                    message.success(message.translate('administration/api:SUCCESS')));

            return message.dm(message.translate('administration/api:KEY', {
                guild: message.guild.name,
                key: newApiKey
            }));
        }
        return message.error(message.translate('common:INVALID_OPTION'));
    }
}
