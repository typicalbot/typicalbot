import TypicalFunction from '../structures/Function';
import Command from '../structures/Command';
import PermissionLevel from '../structures/PermissionLevel';
import { TypicalGuildMessage } from '../types/typicalbot';

export default class PermissionError extends TypicalFunction {
    execute(
        message: TypicalGuildMessage,
        command: Command,
        userLevel: PermissionLevel,
        permission?: 0 | 1 | -1 | 2 | 3 | 4 | 10
    ) {
        const requiredLevel = this.client.handlers.permissions.levels.get(
            permission ? permission : command.permission
        ) as PermissionLevel;

        return message.translate('misc:MISSING_PERMS', {
            requiredLevel: requiredLevel.level,
            requiredTitle: requiredLevel.title,
            userLevel: userLevel.level,
            userTitle: userLevel.title
        });
    }
}
