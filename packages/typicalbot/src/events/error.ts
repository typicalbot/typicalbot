import Event from '../structures/Event';

export default class Error extends Event {
    once = true;

    async execute(error: Error) {
        console.error(error);
    }
}
