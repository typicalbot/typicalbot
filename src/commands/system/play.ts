import Command from '../../lib/structures/Command';
import { Modes } from '../../lib/utils/constants';
import { TypicalMessage } from '../../types/typicalbot';

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
