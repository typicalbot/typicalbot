import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { resolveMember } from '../../lib/utils/util';
import { MessageEmbed } from 'discord.js';
import { MODE } from '../../lib/utils/constants';

const regex = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i;

export default class extends Command {
    mode = MODE.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) ?? [];
        args.shift();
        const [id, username, discriminator] = args;
        const member = await resolveMember(this.client, message, id, username, discriminator);
        if (!member) return message.translate('common:USER_NOT_FOUND');

        const user = member.user;

        if (!message.embeddable) {
            return message.reply(user.displayAvatarURL({
                format: user.avatar?.startsWith('a_') ? 'gif' : 'png',
                size: 2048
            }));
        }

        return message.send(new MessageEmbed()
            .setTitle(user.tag)
            .setDescription(`${message.translate('common:ID_FIELD')}: ${user.id}`)
            .setImage(user.displayAvatarURL({
                format: user.avatar?.startsWith('a_') ? 'gif' : 'png',
                size: 2048
            })));
    }
}
