import Command from '../../structures/Command';
import { TypicalMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

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
    mode = Constants.Modes.LITE;

    async execute(message: TypicalMessage) {
        return message.send(message.translate('system/play:DISCONTINUED'));
    }
}
