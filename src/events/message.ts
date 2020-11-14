import { inspect } from 'util';
import { Message, GuildMember, User } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage, GuildSettings } from '../lib/types/typicalbot';
import { PERMISSION_LEVEL, MODE } from '../lib/utils/constants';
import { fetchAccess } from '../lib/utils/util';
import { permissionError } from '../lib/utils/util';

export default class extends Event {
    async execute(message: Message | TypicalGuildMessage) {
        if (message.partial || (message.author?.bot)) return;

        if (message.channel.type === 'dm')
            return this.handleDM(message as Message);

        return this.handleGuild(message as TypicalGuildMessage);
    }

    async handleGuild(message: TypicalGuildMessage) {
        if (!message.guild.available) return;
        if (!message.guild.me)
            await message.guild.members.fetch(process.env.ID!);

        const botMember = message.guild.me as GuildMember;
        const botSendPerms = message.channel.permissionsFor(botMember);
        if (!botSendPerms || !botSendPerms.has('SEND_MESSAGES')) return;

        const settings = (message.guild.settings = await message.guild.fetchSettings());

        const possibleBotMentions = [
            `<@${process.env.ID}>`,
            `<@!${process.env.ID}>`
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

        if (
            userPermissions.level <
            PERMISSION_LEVEL.SERVER_MODERATOR &&
            !settings.ignored.invites.includes(message.channel.id)
        )
            this.inviteCheck(message);
        if (
            userPermissions.level <
            PERMISSION_LEVEL.SERVER_MODERATOR &&
            settings.ignored.commands.includes(message.channel.id)
        )
            return;
        if (
            userPermissions.level ===
            PERMISSION_LEVEL.SERVER_BLACKLISTED
        )
            return;

        const [split, ...params] = message.content.split(' ');

        const prefix = this.matchPrefix(message.author, settings, split);
        if (!prefix || !message.content.startsWith(prefix)) return;

        const command = this.client.commands.fetch(split.slice(prefix.length).toLowerCase(), settings);
        if (!command) return;
        if (!message.member)
            await message.guild.members.fetch(message.author.id);

        if (command.ptb && process.env.BUILD !== 'ptb')
            return message.error(message.translate('misc:PTB_ONLY'));

        const accessLevel = await fetchAccess(message.guild);
        if (command.access && accessLevel.level < command.access) {
            return message.error(message.translate('misc:MISSING_ACCESS', {
                command: command.access,
                level: accessLevel.level,
                title: accessLevel.title
            }));
        }

        if (
            !this.client.owners.includes(message.author.id) &&
            message.author.id !== message.guild.ownerID &&
            command.mode <
            (settings.mode === 'free'
                ? MODE.FREE
                : settings.mode === 'lite'
                    ? MODE.LITE
                    : MODE.STRICT)
        )
            return message.error(message.translate('misc:DISABLED'));

        if (
            userPermissions.level < command.permission ||
            (actualUserPermissions.level < command.permission &&
                actualUserPermissions.level !==
                PERMISSION_LEVEL.SERVER_BLACKLISTED &&
                command.permission <= PERMISSION_LEVEL.SERVER_OWNER)
        ) {
            return message.error(permissionError(this.client, message, command, actualUserPermissions));
        }

        this.client.analytics.addEvent({
            userId: message.author.id,
            eventType: 'COMMAND_CREATE',
            eventProperties: {
                messageId: message.id,
                channelId: message.channel.id,
                guildId: message.guild.id,
                timestamp: message.createdTimestamp,
                command: command.name,
                commandArgs: params
            }
        });

        return command.execute(message, params.join(' '), userPermissions);
    }

    matchPrefix(user: User, settings: GuildSettings, command: string) {
        if (
            command.startsWith(process.env.PREFIX!) &&
            this.client.owners.includes(user.id)
        )
            return process.env.PREFIX;
        if (
            settings.prefix.custom &&
            command.startsWith(settings.prefix.custom)
        )
            return settings.prefix.custom;
        if (
            settings.prefix.default &&
            command.startsWith(process.env.PREFIX!)
        )
            return process.env.PREFIX;

        return null;
    }

    inviteCheck(message: TypicalGuildMessage) {
        if (!message.guild.settings.automod.invite) return;
        const inviteRegex = /(discord\.(gg|io|me|li|plus|link)\/.+|discord(?:app)?\.com\/invite\/.+)/i;
        if (
            inviteRegex.test(message.content) ||
            inviteRegex.test(inspect(message.embeds, { depth: 4 }))
        )
            this.client.emit('guildInvitePosted', message);
    }

    handleDM(message: Message) {
        if (!message.content.startsWith(process.env.PREFIX!)) return;

        const command = this.client.commands.get(message.content
            .split(' ')[0]
            .slice(process.env.PREFIX!.length));

        if (
            !command ||
            !command.dm ||
            command.permission > PERMISSION_LEVEL.SERVER_MEMBER
        )
            return;

        command.execute(message);
    }
}
