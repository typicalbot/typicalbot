import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';
import { permissionError, resolveMember } from '../../lib/utils/util';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?(?:\s+)?(?:(?:<@&)?(\d{17,20})>?|(.+))/i;

export default class extends Command {
    mode = MODE.STRICT;
    aliases = ['iamnot'];

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        if (!message.guild.me?.permissions.has('MANAGE_ROLES', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Manage Roles'
            }));

        const [id, username, discriminator, roleID, roleName] = args;
        const permissions = await message.member.fetchPermissions(true);

        const member = await resolveMember(this.client, message, id, username, discriminator, false);

        const role = roleID
            ? message.guild.roles.cache.get(roleID)
            : roleName
                ? message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase())
                : null;
        if (!role)
            return message.error(message.translate('moderation/give:INVALID'));
        if (!role.editable)
            return message.error(message.translate('moderation/take:UNEDITABLE'));

        if (member) {
            if (
                permissions.level <
                PERMISSION_LEVEL.SERVER_ADMINISTRATOR
            ) {
                return message.error(permissionError(this.client, message, this, permissions));
            }

            const removed = await member.roles.remove(role).catch(() => null);
            if (!removed)
                return message.error(message.translate('common:REQUEST_ERROR'));

            return message.reply(message.translate('common:SUCCESS'));
        } else {
            const publicList = message.guild.settings.roles.public;
            if (!publicList.includes(role.id))
                return message.error(message.translate('moderation/give:NOT_PUBLIC'));

            const removed = await message.member.roles
                .remove(role)
                .catch(() => null);
            if (!removed)
                return message.error(message.translate('common:REQUEST_ERROR'));

            return message.reply(message.translate('common:SUCCESS'));
        }
    }
}
