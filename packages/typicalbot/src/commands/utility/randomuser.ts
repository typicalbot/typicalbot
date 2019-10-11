import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(-o(?:nline)?\s)?/i;

export default class extends Command {
    aliases = ['ruser'];
    mode = Constants.Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);

        const members = args ? message.guild.members.filter((m) => m.presence.status !== 'offline') : message.guild.members;
        if (!members.size) return null;

        const member = members.random();
        
        return message.send(message.translate('randomuser:RANDOM', {
            tag: member.user.tag,
            id: member.id
        }));
    }
};
