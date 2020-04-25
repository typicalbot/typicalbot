import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

export default class extends Command {
    aliases = [
        'current',
        'np',
        'q',
        'queue',
        'resume',
        'skip',
        'song',
        'stop',
        'vol',
        'volume'
    ];
    mode = Modes.LITE;

    async execute(message: TypicalMessage) {
        return message.send(message.translate('system/play:DISCONTINUED'));
    }
}
