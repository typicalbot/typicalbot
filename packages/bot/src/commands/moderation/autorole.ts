import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage) {
        this.client.handlers.moderationLog.processAutoRoles();
        await message.send(message.translate('moderation/autorole:SYNC'));
    }
}
