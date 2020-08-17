import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels } from '../../lib/utils/constants';
import { permissionError, resolveMember } from '../../lib/utils/util';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?(?:\s+)?(?:(?:<@&)?(\d{17,20})>?|(.+))/i;

export default class extends Command {
    mode = Modes.STRICT;
    aliases = ['iam'];

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
            return message.error(message.translate('moderation/give:UNEDITABLE'));

        if (member) {
            if (permissions.level < PermissionsLevels.SERVER_ADMINISTRATOR) {
                // eslint-disable-next-line max-len
                return message.error(permissionError(this.client, message, this, permissions, PermissionsLevels.SERVER_ADMINISTRATOR));
            }

            const added = await member.roles.add(role).catch(() => null);

            return added
                ? message.reply(message.translate('common:SUCCESS'))
                : message.error(message.translate('common:REQUEST_ERROR'));
        }

        // Giving role to self

        const publicList = message.guild.settings.roles.public;
        if (!publicList.includes(role.id))
            return message.error(message.translate('moderation/give:NOT_PUBLIC'));

        const added = await message.member.roles.add(role).catch(() => null);

        return added
            ? message.reply(message.translate('common:SUCCESS'))
            : message.error(message.translate('common:REQUEST_ERROR'));
    }
}
