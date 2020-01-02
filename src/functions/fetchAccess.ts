import Function from '../structures/Function';
import Constants from '../utility/Constants';
import { TypicalGuild } from '../types/typicalbot';

export default class FetchAccess extends Function {
    async execute(guild: TypicalGuild) {
        if ((await guild.fetchPermissions(guild.ownerID)).level > 5)
            return Constants.AccessTitles.STAFF;

        const donor = this.client.caches.donors.get(guild.ownerID);
        if (donor && donor.amount >= 5) return Constants.AccessTitles.DONOR;

        return Constants.AccessTitles.DEFAULT;
    }
}
