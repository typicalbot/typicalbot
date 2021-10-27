import Handler from '../lib/handler/Handler';
import { NewsChannel, Permissions, TextChannel } from 'discord.js';

const regex = /<@![0-9]{18}>/gm;
const requiredPermissions = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']).freeze();

const UserMentionSpamHandler: Handler<'messageCreate'> = async (client, message) => {
    if (message.author.bot || message.webhookID || message.partial) return;
    if (message.channel.type === 'dm') return;

    const me = message.guild!.me ?? await message.guild!.members.fetch(`${BigInt(client.id!)}`);
    if (!me) return;

    const channel = message.channel as TextChannel | NewsChannel;
    if (!channel.permissionsFor(me)!.has(requiredPermissions, false)) return;

    if (!message.guild!.available) return;
    if (!message.deletable) return;

    const settings = await client.settings.fetch(message.guild!.id);
    if (!settings.automod.spam.mentions.enabled) return;

    if (regex.test(message.content)) {
        await message.delete();
    }

    // Commenting this section out as the moderation log handler requires a TypicalGuildMessage which won't exist with the removal of the event handler.
    /**
    if (settings.logs.moderation) {
        const _ = (key: string, args?: Record<string, unknown>) => {
            const lang = client.translate.get(settings.language || 'en_US');

            if (!lang) throw new Error('Message: Invalid language set in settings.');

            return lang(key, args);
        };

        await client.handlers.moderationLog
            .buildCase(message.guild)
            .setAction(MODERATION_LOG_TYPE.WARN)
            .setModerator(client.user as User)
            .setUser(message.author)
            .setReason(_('general/spam:REASON', {
                action: _('common:WARN'),
                type: _('general/spam:SPAM'),
                channel: `<#${message.channel.id}>`
            }));
    }
     */
};

const UserMentionSpamHandlerTwo: Handler<'messageUpdate'> = async (client, oldMessage, newMessage) => {
    if (!newMessage.deletable) return;

    const settings = await client.settings.fetch(newMessage.guild!.id);
    if (!settings.automod.spam.mentions.enabled) return;

    if (regex.test(newMessage.content!)) {
        await newMessage.delete();
    }

    // Commenting this section out as the moderation log handler requires a TypicalGuildMessage which won't exist with the removal of the event handler.
    /**
     if (settings.logs.moderation) {
        const _ = (key: string, args?: Record<string, unknown>) => {
            const lang = client.translate.get(settings.language || 'en_US');

            if (!lang) throw new Error('Message: Invalid language set in settings.');

            return lang(key, args);
        };

        await client.handlers.moderationLog
            .buildCase(message.guild)
            .setAction(MODERATION_LOG_TYPE.WARN)
            .setModerator(client.user as User)
            .setUser(message.author)
            .setReason(_('general/spam:REASON', {
                action: _('common:WARN'),
                type: _('general/spam:SPAM'),
                channel: `<#${message.channel.id}>`
            }));
    }
     */
};

export {
    UserMentionSpamHandler,
    UserMentionSpamHandlerTwo
};