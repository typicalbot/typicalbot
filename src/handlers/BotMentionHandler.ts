import Handler from '../lib/handler/Handler';
import { NewsChannel, Permissions, TextChannel } from 'discord.js';
import TypicalClient from '../lib/TypicalClient';

const requiredPermissions = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']).freeze();

const BotMentionHandler: Handler<'messageCreate'> = async (client, message) => {
    if (message.author.bot || message.webhookID || message.partial) return;
    if (message.channel.type === 'dm') return;

    const me = message.guild!.me ?? await message.guild!.members.fetch(`${BigInt(client.id!)}`);
    if (!me) return;

    const channel = message.channel as TextChannel | NewsChannel;
    if (!channel.permissionsFor(me)!.has(requiredPermissions, false)) return;

    if (!message.guild!.available) return;

    const possibleMentions = [
        `<@${client.id!}>`,
        `<@!${client.id!}>`,
    ];
    if (!possibleMentions.includes(message.content)) return;

    const settings = await client.settings.fetch(message.guild!.id);

    const _ = (key: string, args?: Record<string, unknown>) => {
        const lang = client.translate.get(settings.language || 'en_US');

        if (!lang) throw new Error('Message: Invalid language set in settings.');

        return lang(key, args);
    };

    const prefix = settings.prefix.custom
        ? settings.prefix.default
            ? _('misc:MULTIPLE_PREFIXES', {
                default: process.env.PREFIX!,
                custom: settings.prefix.custom
            })
            : `${settings.prefix.custom}`
        : `${process.env.PREFIX!}`;

    return message.reply({
        content: _('misc:PREFIX', { prefix })
    });
};

export default BotMentionHandler;
