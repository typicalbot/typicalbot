import * as Sentry from '@sentry/node';
import Event from '../structures/Event';

export default class Error extends Event {
    once = true;

    async execute(error: Error) {
        Sentry.captureException(error);
    }
}
