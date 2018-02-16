const Event = require("../structures/Event");
const Constants = require("../utility/Constants");
const { Collection } = require("discord.js");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(message) {
        const settings = await this.client.settings.fetch(message.guild.id);
        
        const cache = this.client.caches.invites;
        const uCache = cache.get(`${message.guild.id}-${message.author.id}`);
        
        if (settings.automod.invite && settings.automod.invitewarn) {
            if (!cache) {
                cache.set(`${message.guild.id}-${message.author.id}`, new Collection());
                cache.get(`${message.guild.id}-${message.author.id}`).set(message.id, setTimeout(() => this.client.caches.invites.get(`${message.guild.id}-${message.author.id}`.delete(message.id)), 30000));

                if (settings.logs.moderation)
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLog.Types.WARN)
                        .setModerator(this.client.user)
                        .setUser(message.author)
                        .setReason("Automatic Warning: User posted an invite.")
                        .send();
            } else if (cache.length > 0 && cache.length < 3 ) {
                uCache.set(message.id, setTimeout(() => this.client.caches.invites.get(`${message.guild.id}-${message.author.id}`.delete(message.id)), 30000));
            } else if (cache.length >= 3) {
                message.member.kick("Automatic Kick: User posted three consecutive invites.");

                if (settings.logs.moderation)
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLog.Types.KICK)
                        .setModerator(this.client.user)
                        .setUser(message.author)
                        .setReason("Automatic Kick: User posted three consecutive invites.")
                        .send();
            }
        }

        if (!settings.logs.id || !settings.logs.invite) return;
        
        const channel = message.guild.channels.get(settings.logs.id);
        if (!channel) return;

        channel.send(
            settings.logs.invite === "--enabled" ?
                `**${message.author.username}#${message.author.discriminator}** posted an invite in <#${message.channel.id}>.` :
                this.client.functions.formatMessage("logs-invite", message.guild, message.author, settings.logs.invite, { channel: message.channel })
        );
    }
}

module.exports = New;
