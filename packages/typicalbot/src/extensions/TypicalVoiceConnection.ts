import { Structures } from 'discord.js';
import Stream from '../structures/Stream';

export class TypicalVoiceConnection extends Structures.get('VoiceConnection') {
    _guildStream: Stream | null = null;

    get guildStream() {
        if (!this._guildStream)
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this._guildStream = new Stream(this.client, this);

        return this._guildStream as Stream;
    }
}

Structures.extend('VoiceConnection', () => TypicalVoiceConnection);
