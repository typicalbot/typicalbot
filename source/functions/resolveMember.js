const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute(message, [ match, id, username, discriminator ], returnSelf = true) {
        if (id) {
            const user = await this.client.users.fetch(id).catch(console.error);
            if (!user) return returnSelf ? message.member : null;

            const member = await message.guild.members.fetch(user).catch(console.error);
            if (!member) return returnSelf ? message.member : null;

            return member;
        } else if (username && discriminator) {
            await message.guild.members.fetch({ "query": username }).catch(console.error);

            const member = message.guild.members.find(m => m.user.tag === `${username}#${discriminator}`);
            if (!member) return returnSelf ? message.member : null;

            return member;
        } else return message.member;
    }
}

module.exports = New;
