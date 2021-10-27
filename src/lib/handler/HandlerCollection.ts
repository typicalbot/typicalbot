import { ClientEvents, Collection } from 'discord.js';
import Handler from './Handler';

class HandlerCollection extends Collection<keyof ClientEvents, Handler<any>[]> {
    add(event: keyof ClientEvents, handler: Handler<any>) {
        if (super.has(event)) {
            const item = super.get(event)!;
            item.push(handler);
            super.set(event, item);
        } else {
            super.set(event, [handler]);
        }
    }
}

export default HandlerCollection;
