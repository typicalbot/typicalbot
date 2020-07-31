import { Collection, User } from 'discord.js';
import Command from './Command';

export default class Bucket extends Collection<string, Collection<string, number>> {
    create(command: Command) {
        if (!this.has(command.name)) {
            this.set(command.name, new Collection());
        }

        return this;
    }

    check(command: Command, user: User, callback: (remaining: string) => void) {
        const bucket = this.get(command.name)!;
        const cooldown = command.cooldown * 1000;
        const now = Date.now();

        if (!bucket.has(user.id)) {
            bucket.set(user.id, now);
            setTimeout(() => bucket.delete(user.id), cooldown);
        } else {
            const time = bucket.get(user.id)!;

            if (now < time) {
                const remaining = (time - now) / 1000;
                callback(remaining.toFixed());
            }

            bucket.set(user.id, now);
            setTimeout(() => bucket.delete(user.id), cooldown);
        }
    }
}
