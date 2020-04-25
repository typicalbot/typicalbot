import Function from '../lib/structures/Function';
import { TypicalGuild } from '../lib/types/typicalbot';
import { AccessTitles } from '../lib/utils/constants';

export default class FetchAccess extends Function {
    async execute(guild: TypicalGuild) {
        if ((await guild.fetchPermissions(guild.ownerID)).level > 5)
            return AccessTitles.STAFF;

        const donor = this.client.caches.donors.get(guild.ownerID);
        if (donor && donor.amount >= 5) return AccessTitles.DONOR;

        return AccessTitles.DEFAULT;
    }
}
