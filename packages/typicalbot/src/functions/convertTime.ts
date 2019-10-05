import TypicalFunction from '../structures/Function';
import { TypicalMessage } from '../types/typicalbot';

export default class ConvertTime extends TypicalFunction {
    execute(message: TypicalMessage, time: number) {
        const absoluteSeconds = (time / 1000) % 60;
        const absoluteMinutes = (time / (1000 * 60)) % 60;
        const absoluteHours = (time / (1000 * 60 * 60)) % 24;
        const absoluteDays = time / (1000 * 60 * 60 * 24);

        const d = absoluteDays
            ? absoluteDays === 1
                ? message.translate('time:ONE_DAY')
                : message.translate('time:DAYS', { amount: absoluteDays })
            : null;
        const h = absoluteHours
            ? absoluteHours === 1
                ? message.translate('time:ONE_HOUR')
                : message.translate('time:HOURS', { amount: absoluteHours })
            : null;
        const m = absoluteMinutes
            ? absoluteMinutes === 1
                ? message.translate('time:ONE_MINUTE')
                : message.translate('time:MINUTES', { amount: absoluteMinutes })
            : null;
        const s = absoluteSeconds
            ? absoluteSeconds === 1
                ? message.translate('time:ONE_SECOND')
                : message.translate('time:SECONDS', { amount: absoluteSeconds })
            : null;

        const absoluteTime = [];
        if (d) absoluteTime.push(d);
        if (h) absoluteTime.push(h);
        if (m) absoluteTime.push(m);
        if (s) absoluteTime.push(s);

        return absoluteTime.join(', ');
    }
}
