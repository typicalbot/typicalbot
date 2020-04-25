import Function from '../lib/structures/Function';
import { TypicalGuildMessage } from '../lib/types/typicalbot';

export default class ResolveMember extends Function {
    async execute(message: TypicalGuildMessage,
        id?: string,
        username?: string,
        discriminator?: string,
        returnSelf = true) {
        if (id) {
            const user = await this.client.users.fetch(id).catch(console.error);
            if (!user) return returnSelf ? message.member : null;

            const member = await message.guild.members
                .fetch(user)
                .catch(console.error);
            if (!member) return returnSelf ? message.member : null;

            return member;
        }

        if (username && discriminator) {
            await message.guild.members
                .fetch({ query: username })
                .catch(console.error);

            const member = message.guild.members.cache.find((m) => m.user.tag === `${username}#${discriminator}`);
            if (!member) return returnSelf ? message.member : null;

            return member;
        }

        return returnSelf ? message.member : null;
    }
}
