import { User } from 'discord.js';
import Task from '../lib/structures/Task';
import { UnbanTaskData } from '../lib/types/typicalbot';

export default class extends Task {
    async execute(data: UnbanTaskData): Promise<void> {
        const guild = this.client.guilds.cache.get(`${BigInt(data.userID)}`);
        if (!guild) return;

        if (!guild.me?.permissions.has('BAN_MEMBERS', true)) return;

        this.client.caches.unbans.set(data.userID, {
            moderator: this.client.user as User,
            reason: "Automatic Unban: User's ban time has passed."
        });

        await guild.members.unban(`${BigInt(data.userID)}`, "Automatic Unban: User's ban time has passed.");
    }
}
