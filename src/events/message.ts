import { inspect } from 'util';
import { Message, User, TextChannel, NewsChannel, Permissions } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage, GuildSettings } from '../lib/types/typicalbot';
import { PERMISSION_LEVEL, MODE } from '../lib/utils/constants';
import { fetchAccess } from '../lib/utils/util';
import { permissionError } from '../lib/utils/util';
import * as Sentry from '@sentry/node';
import { GuildCustomCommand } from '../common/types/TypicalBotGuild';

export default class extends Event {
    readonly requiredPermissions = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']).freeze();

    async execute(message: Message | TypicalGuildMessage) {
        if (message.author.bot || message.webhookID || message.partial) return;

        if (message.channel.type === 'dm')
            return this.handleDM(message as Message);

        const me = message.guild!.me ?? await message.guild!.members.fetch(`${BigInt(this.client.id!)}`);
        if (!me) return;

        const channel = message.channel as TextChannel | NewsChannel;
        if (!channel.permissionsFor(me)!.has(this.requiredPermissions, false)) return;

        return this.handleGuild(message as TypicalGuildMessage)
            .catch(err => Sentry.captureMessage(err, scope => {
                scope.clear();
                scope.setTag('guildId', message.guild!.id);
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }

    async handleGuild(message: TypicalGuildMessage) {
        if (!message.guild.available) return;

        const settings = (message.guild.settings = await message.guild.fetchSettings());

        const possibleBotMentions = [
            `<@${this.client.id!}>`,
            `<@!${this.client.id!}>`
        ];

        if (possibleBotMentions.includes(message.content)) {
            const prefix = settings.prefix.custom
                ? settings.prefix.default
                    ? message.translate('misc:MULTIPLE_PREFIXES', {
                        default: process.env.PREFIX,
                        custom: settings.prefix.custom
                    })
                    : `\`${settings.prefix.custom}\``
                : `\`${process.env.PREFIX}\``;

            return message.reply(message.translate('misc:PREFIX', { prefix }));
        }

        const userPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author.id);
        // eslint-disable-next-line max-len
        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author.id, true);

        if (userPermissions.level < PERMISSION_LEVEL.SERVER_MODERATOR && !settings.ignored.invites.includes(message.channel.id))
            this.inviteCheck(message);

        if (userPermissions.level < PERMISSION_LEVEL.SERVER_MODERATOR)
            this.spamCheck(message);

        if (userPermissions.level < PERMISSION_LEVEL.SERVER_MODERATOR && settings.ignored.commands.includes(message.channel.id))
            return;

        if (userPermissions.level === PERMISSION_LEVEL.SERVER_BLACKLISTED)
            return;

        const [split, ...params] = message.content.split(' ');

        const prefix = this.matchPrefix(message.author, settings, split);
        if (!prefix || !message.content.startsWith(prefix)) return;

        const raw = split.slice(prefix.length).toLowerCase();
        const command = this.client.commands.fetch(raw, settings);

        if (!command) {
            const customCommand = (await this.client.database.get('custom_commands', { guildId: message.guild.id, command: raw })) as GuildCustomCommand;

            if (!customCommand) {
                return;
            } else {
                return message.send(customCommand.content);
            }
        }

        if (!message.member)
            await message.guild.members.fetch(message.author.id);

        const accessLevel = await fetchAccess(message.guild);

        if (command.access && accessLevel.level < command.access) {
            return message.error(message.translate('misc:MISSING_ACCESS', {
                command: command.access,
                level: accessLevel.level,
                title: accessLevel.title
            }));
        }

        if (!this.client.owners.includes(message.author.id) && message.author.id !== message.guild.ownerID && command.mode < (settings.mode === 'free' ? MODE.FREE : settings.mode === 'lite' ? MODE.LITE : MODE.STRICT))
            return message.error(message.translate('misc:DISABLED'));

        if (userPermissions.level < command.permission || (actualUserPermissions.level < command.permission && actualUserPermissions.level !== PERMISSION_LEVEL.SERVER_BLACKLISTED && command.permission <= PERMISSION_LEVEL.SERVER_OWNER)) {
            return message.error(permissionError(this.client, message, command, actualUserPermissions));
        }

        return command.execute(message, params.join(' '), userPermissions);
    }

    matchPrefix(user: User, settings: GuildSettings, command: string) {
        if (command.startsWith(process.env.PREFIX!) && this.client.owners.includes(user.id))
            return process.env.PREFIX;

        if (settings.prefix.custom && command.startsWith(settings.prefix.custom))
            return settings.prefix.custom;

        if (settings.prefix.default && command.startsWith(process.env.PREFIX!))
            return process.env.PREFIX;

        return null;
    }

    inviteCheck(message: TypicalGuildMessage) {
        if (!message.guild.settings.automod.invite) return;

        const inviteRegex = /(discord\.(gg|io|me|li|plus|link)\/.+|discord(?:app)?\.com\/invite\/.+)/i;

        if (inviteRegex.test(message.content) || inviteRegex.test(inspect(message.embeds, { depth: 4 })))
            this.client.emit('guildInvitePosted', message);
    }

    spamCheck(message: TypicalGuildMessage) {
        try {
            if (message.guild.settings.automod.spam.caps.enabled) {
                const capsRegex = /[A-Z]/g;
                const severity = message.guild.settings.automod.spam.caps.severity;

                if (message.content.length > 5 && (message.content.match(capsRegex)!.length / message.content.length) >= (severity / 10))
                    this.client.emit('guildSpamPosted', message);
            }

            if (message.guild.settings.automod.spam.mentions.enabled) {
                const mentionsRegex = /<@![0-9]{18}>/gm;
                const severity = message.guild.settings.automod.spam.mentions.severity;

                if (message.content.match(mentionsRegex)!.length >= severity)
                    this.client.emit('guildSpamPosted', message);
            }

            if (message.guild.settings.automod.spam.zalgo.enabled) {
                // eslint-disable-next-line no-control-regex
                const zalgoRegex = /[^\u0000-\u007F]/g;
                const severity = message.guild.settings.automod.spam.zalgo.severity;

                if (message.content.match(zalgoRegex)!.length >= severity)
                    this.client.emit('guildSpamPosted', message);
            }

            if (message.guild.settings.automod.spam.scamlinks.enabled) {
                const content = message.content.split(' ');

                if (content.some(word => this.client.scamlinks.includes(word))) {
                    this.client.emit('guildSpamPosted', message);
                }
            }
        } catch (ex) {
            Sentry.captureException(ex);
        }
    }

    handleDM(message: Message) {
        if (!message.content.startsWith(process.env.PREFIX!)) return;

        const command = this.client.commands.get(message.content
            .split(' ')[0]
            .slice(process.env.PREFIX!.length));

        if (!command || !command.dm || command.permission > PERMISSION_LEVEL.SERVER_MEMBER)
            return;

        command.execute(message);
    }
}
