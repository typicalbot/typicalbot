const Event = require("../structures/Event");
const Constants = require("../utility/Constants");
const { Collection } = require("discord.js");

class GuildInvitePosted extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(message) {
        message.delete().then(() => message.error("This server prohibits invites from being sent. Your message has been deleted."));

        const settings = message.guild.settings;

        if (settings.automod.inviteaction && (settings.automod.invitewarn || settings.automod.invitekick)) {
            let cache = this.client.caches.invites.get(`${message.guild.id}-${message.author.id}`);

            if (!cache) {
                this.client.caches.invites.set(`${message.guild.id}-${message.author.id}`, new Collection());
                cache = this.client.caches.invites.get(`${message.guild.id}-${message.author.id}`);
            }

            cache.set(message.id, setTimeout(() => cache.delete(message.id), 60000));

            if (settings.automod.invitewarn !== 0 && cache.size === settings.automod.invitewarn) {
                if (settings.logs.moderation)
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLog.Types.WARN)
                        .setModerator(this.client.user)
                        .setUser(message.author)
                        .setReason(`Automatic Warn: User sent ${settings.automod.invitewarn === 1 ? "an invite" : `${settings.automod.invitewarn} consecutive invites`} in #${message.channel.name} (${message.channel.id}).`)
                        .send();
            } else if (settings.automod.invitekick !== 0 && cache.size >= settings.automod.invitekick) {
                message.member.kick(`Automatic Kick: User sent ${settings.automod.invitekick === 1 ? "an invite" : `${settings.automod.invitekick} consecutive invites`} in #${message.channel.name} (${message.channel.id}).`);

                if (settings.logs.moderation)
                    this.client.handlers.moderationLog
                        .buildCase(message.guild)
                        .setAction(Constants.ModerationLog.Types.KICK)
                        .setModerator(this.client.user)
                        .setUser(message.author)
                        .setReason(`Automatic Kick: User sent ${settings.automod.invitekick === 1 ? "an invite" : `${settings.automod.invitekick} consecutive invites`} in #${message.channel.name} (${message.channel.id}).`)
                        .send();
            }
        }

        if (!settings.logs.id || !settings.logs.invite) return;

        const channel = message.guild.channels.get(settings.logs.id);
        if (!channel) return;

        if (settings.logs.invite === "--embed") {
            channel.buildEmbed()
                .setColor(0x00FF00)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter(`Invite sent in <#${message.channel.id}>.`)
                .setTimestamp()
                .send()
                .catch(() => { return; });
        } else {
            channel.send(
                settings.logs.invite === "--enabled" ?
                    `**${message.author.username}#${message.author.discriminator}** sent an invite in <#${message.channel.id}>.` :
                    this.client.functions.formatMessage("logs-invite", message.guild, message.author, settings.logs.invite, { channel: message.channel })
            );
        }
    }
}

module.exports = GuildInvitePosted;
