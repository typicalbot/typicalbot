import Task from '../structures/Task';
import { UnbanTaskData } from '../types/typicalbot';

export default class extends Task {
    async execute(data: UnbanTaskData) {
        const guild = this.client.guilds.get(data.guildID);
        if (!guild) return;

        this.client.caches.unbans.set(data.userID, {
            moderator: this.client.user,
            reason: "Automatic Unban: User's ban time has passed."
        });

        guild.members.unban(
            data.userID,
            "Automatic Unban: User's ban time has passed."
        );
    }
}
