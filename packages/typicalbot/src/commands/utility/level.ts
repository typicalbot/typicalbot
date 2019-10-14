import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i;

export default class extends Command {
    aliases = ['mylevel'];
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) || [];
        args.shift();
        const [id, username, discriminator] = args;
        const member = await this.client.helpers.resolveMember.execute(
            message,
            id,
            username,
            discriminator
        );
        if (!member) return message.error('common:USER_NOT_FOUND');

        const permissionsHere = await this.client.handlers.permissions.fetch(
            message.guild,
            member.id,
            true
        );
        const permissions = await this.client.handlers.permissions.fetch(
            message.guild,
            member.id
        );

        if (!message.embedable)
            return message.reply(
                message.translate('utility/level:TEXT', {
                    level: `${permissions.level} | ${permissions.title}${
                        permissionsHere.level !== permissions.level
                            ? ` (${permissionsHere.level} | ${permissionsHere.title})`
                            : ''
                    }`
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(
                    message.translate('utility/level:TITLE', {
                        user: member.user.tag
                    })
                )
                .setDescription(
                    message.translate('utility/level:EMBED', {
                        level: `${permissions.level} | ${permissions.title}${
                            permissionsHere.level !== permissions.level
                                ? ` (${permissionsHere.level} | ${permissionsHere.title})`
                                : ''
                        }`
                    })
                )
        );
    }
}
