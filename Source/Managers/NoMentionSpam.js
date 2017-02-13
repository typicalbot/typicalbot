const rateLimit = 7500;

class NoMentionSpam {
    constructor() {
        this.rated = new Map();
    }

    init(message) {
        let entry = this.rated.get(message.author.id);
        if (!entry) { entry = 0; this.rated.set(message.author.id, 0); }

        entry += message.mentions.users.size + message.mentions.roles.size;

        this.rated.set(message.author.id, entry);

        setTimeout(() => {
            entry -= message.mentions.users.size + message.mentions.roles.size;
            if (entry <= 0) this.rated.delete(message.author.id);
        }, rateLimit);

        return entry;
    }

    execute(response) {
        if (response.message.mentions.users.size + response.message.mentions.roles.size === 0) return;

        let entry = this.init(response.message);

        if (entry > (response.message.guild.settings.mentionlimit || 10)) {
            this.rated.delete(response.message.author.id);

            response.message.channel.overwritePermissions(response.message.author, { SEND_MESSAGES: false }).then(() => {
                response.error(`Calm down! You've hit this server's mention limit and have been muted for 30 seconds!`);

                let overwrite = response.message.channel.permissionOverwrites.get(response.message.author.id);
                setTimeout(() => overwrite.delete(), 30000);
            }).catch(err => {
                response.error(`Calm down! You've hit this server's mention limit!`);
            });
        }
    }
}

module.exports = NoMentionSpam;
