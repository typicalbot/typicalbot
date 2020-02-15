import Event from '../structures/Event';
import * as Sentry from '@sentry/node';

export default class Error extends Event {
    once = true;

    async execute(error: Error) {
        Sentry.captureException(error);
    }
}
