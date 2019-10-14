import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(?:<@!?(\d{17,20})>\s+)?(?:(.{1,32}))?/i;

export default class extends Command {
    aliases = ['nick'];
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) || [];
        args.shift();

        const [userID, nickname] = args;
        const member = userID
            ? await message.guild.members.fetch(userID).catch(() => null)
            : null;
        const reset = !nickname || nickname === 'reset';
        const type = message
            .translate(reset ? 'common:RESET' : 'common:CHANGED')
            .toLowerCase();

        // If a member was not found but a user id was provided cancel
        if (!member && userID) return null;
        // A user id was not found and so edit the authors nickname
        if (!member) {
            if (message.guild.settings.nonickname)
                return message.error('utility/nickname:DISABLED');

            const changed = await message.member
                .setNickname(reset ? '' : nickname)
                .catch(() => null);
            if (!changed)
                return message.error(
                    message.translate('utility/nickname:SELF_ERROR')
                );
            return message.reply(
                message.translate('utility/nickname:SELF_SUCCESS', { type })
            );
        }
        // Edit another members nickname
        const permissions = await this.client.handlers.permissions.fetch(
            message.guild,
            message.author.id,
            true
        );
        if (permissions.level < 2)
            return message.error(
                this.client.helpers.permissionError.execute(
                    message,
                    this,
                    permissions
                )
            );

        const changed = await member
            .setNickname(reset ? '' : nickname)
            .catch(() => null);
        if (!changed)
            return message.error(message.translate('utility/nickname:ERROR'));

        return message.reply(
            message.translate('utility/nickname:SUCCESS', { type })
        );
    }
}
