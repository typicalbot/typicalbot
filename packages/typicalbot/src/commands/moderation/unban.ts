import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import {
    TypicalGuildMessage,
    TaskOptions,
    UnbanTaskData
} from '../../types/typicalbot';
import { Message } from 'discord.js';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
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

        const [userID, reason] = args;

        const user = await this.client.users.fetch(userID).catch(() => null);
        if (!user)
            return message.error(message.translate('common:USER_FETCH_ERROR'));

        const log = { moderator: message.author };
        if (reason) Object.assign(log, { reason });

        this.client.caches.unbans.set(user, log);

        const unbanned = await message.guild.members
            .unban(
                userID,
                message.translate('unban:REASON', {
                    mod: message.author.tag,
                    reason: reason || message.translate('common:NO_REASON')
                })
            )
            .catch(err => {
                if (err === "Error: Couldn't resolve the user ID to unban.")
                    return message.error(
                        message.translate('common:USER_NOT_FOUND')
                    );

                this.client.caches.unbans.delete(userID);
                return message.error(
                    message.translate('common:USER_FETCH_ERROR')
                );
            });

        if (unbanned instanceof Message) return null;

        message.success(
            message.translate('unban:UNBANNED', { user: user.tag })
        );

        const tasks = (await this.client.handlers.database
            .get('tasks')
            .catch(() => [])) as TaskOptions[];

        const relevantTask = tasks.find(
            task =>
                task.type === 'unban' &&
                (task.data as UnbanTaskData).userID === userID
        );
        if (!relevantTask) return null;

        return this.client.handlers.tasks.delete(relevantTask.id);
    }
}
