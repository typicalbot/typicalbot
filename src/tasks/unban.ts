import Task from '../structures/Task';
import { UnbanTaskData } from '../types/typicalbot';
import { User } from 'discord.js';

export default class extends Task {
    async execute(data: UnbanTaskData) {
        const guild = this.client.guilds.cache.get(data.guildID);
        if (!guild) return;

        this.client.caches.unbans.set(data.userID, {
            moderator: this.client.user as User,
            reason: "Automatic Unban: User's ban time has passed."
        });

        await guild.members.unban(
            data.userID,
            "Automatic Unban: User's ban time has passed."
        );
    }
}
