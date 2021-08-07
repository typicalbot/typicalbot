import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE } from '../../lib/utils/constants';
import { resolveMember } from '../../lib/utils/util';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i;

export default class extends Command {
    aliases = ['mylevel'];
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) ?? [];
        args.shift();
        const [id, username, discriminator] = args;
        const member = await resolveMember(this.client, message, id, username, discriminator);
        if (!member) return message.error(message.translate('common:USER_NOT_FOUND'));

        const permissionsHere = await this.client.handlers.permissions.fetch(message.guild, member.id, true);
        const permissions = await this.client.handlers.permissions.fetch(message.guild, member.id);

        if (!message.embeddable)
            return message.reply(message.translate('utility/level:TEXT', {
                level: `${permissions.level} | ${permissions.title}${
                    permissionsHere.level !== permissions.level
                        ? ` (${permissionsHere.level} | ${permissionsHere.title})`
                        : ''
                }`,
                user: member.user.tag
            }));

        return message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('utility/level:TITLE', {
                user: member.user.tag
            }))
            .setDescription(message.translate('utility/level:EMBED', {
                level: `${permissions.level} | ${permissions.title}${
                    permissionsHere.level !== permissions.level
                        ? ` (${permissionsHere.level} | ${permissionsHere.title})`
                        : ''
                }`
            })));
    }
}
