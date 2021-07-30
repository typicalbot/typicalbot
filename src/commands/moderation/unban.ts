import { Message } from 'discord.js';
import Command from '../../lib/structures/Command';
import {
    TypicalGuildMessage
} from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        if (!message.guild.me?.permissions.has('BAN_MEMBERS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Ban Members'
            }));

        const [userID, reason] = args;

        const user = await this.client.users.fetch(userID).catch(() => null);
        if (!user)
            return message.error(message.translate('common:USER_FETCH_ERROR'));

        const log = { moderator: message.author };
        if (reason) Object.assign(log, { reason });

        this.client.caches.unbans.set(user.id, log);

        const unbanned = await message.guild.members
            .unban(userID, message.translate('moderation/unban:REASON', {
                mod: message.author.tag,
                reason: reason || message.translate('common:NO_REASON')
            }))
            .catch((err) => {
                if (err === "Error: Couldn't resolve the user ID to unban.")
                    return message.error(message.translate('common:USER_NOT_FOUND'));

                this.client.caches.unbans.delete(userID);
                return message.error(message.translate('common:USER_FETCH_ERROR'));
            });

        if (unbanned instanceof Message) return null;

        await message.success(message.translate('moderation/unban:UNBANNED', { user: user.tag }));

        // const tasks = (await this.client.database
        //     .getAll('tasks')?.toArray()) as TaskOptions[];

        // const relevantTask = tasks.find((task) =>
        //     task.type === 'unban' &&
        //     (task.data as UnbanTaskData).userID === userID &&
        //     (task.data as UnbanTaskData).guildID === message.guild.id);
        // if (!relevantTask) return null;

        // return this.client.handlers.tasks.delete(relevantTask.id);
    }
}
