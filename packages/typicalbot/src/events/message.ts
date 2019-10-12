import { inspect } from 'util';
import Constants from '../utility/Constants';
import Event from '../structures/Event';
import { TypicalGuildMessage, GuildSettings } from '../types/typicalbot';
import { Message, GuildMember, User } from 'discord.js';

export default class extends Event {
    async execute(message: Message | TypicalGuildMessage) {
        if (message.partial || (message.author && message.author.bot)) return;

        if (message.channel.type === 'dm')
            return this.handleDM(message as Message);

        return this.handleGuild(message as TypicalGuildMessage);
    }

    async handleGuild(message: TypicalGuildMessage) {
        if (!message.guild.available) return;
        if (!message.guild.me)
            await message.guild.members.fetch(this.client.config.id);

        const botMember = message.guild.me as GuildMember;
        const botSendPerms = message.channel.permissionsFor(botMember);
        if (!botSendPerms || !botSendPerms.has('SEND_MESSAGES')) return;

        const settings = (message.guild.settings = await message.guild.fetchSettings());

        const possibleBotMentions = [
            `<@${this.client.config.id}>`,
            `<@!${this.client.config.id}>`
        ];
        if (possibleBotMentions.includes(message.content)) {
            const prefix = settings.prefix.custom
                ? settings.prefix.default
                    ? message.translate('misc:MULTIPLE_PREFIXES', {
                          default: this.client.config.prefix,
                          custom: settings.prefix.custom
                      })
                    : `\`${settings.prefix.custom}\``
                : `\`${this.client.config.prefix}\``;

            return message.reply(message.translate('misc:PREFIX', { prefix }));
        }

        const userPermissions = await this.client.handlers.permissions.fetch(
            message.guild,
            message.author.id
        );
        const actualUserPermissions = await this.client.handlers.permissions.fetch(
            message.guild,
            message.author.id,
            true
        );

        if (
            userPermissions.level <
                Constants.PermissionsLevels.SERVER_MODERATOR &&
            !settings.ignored.invites.includes(message.channel.id)
        )
            this.inviteCheck(message);
        if (
            userPermissions.level <
                Constants.PermissionsLevels.SERVER_MODERATOR &&
            settings.ignored.commands.includes(message.channel.id)
        )
            return;
        if (
            userPermissions.level ===
            Constants.PermissionsLevels.SERVER_BLACKLISTED
        )
            return;

        const [split, ...params] = message.content.split(' ');

        const prefix = this.matchPrefix(message.author, settings, split);
        if (!prefix || !message.content.startsWith(prefix)) return;

        const command = this.client.commands.fetch(
            split.slice(prefix.length).toLowerCase(),
            settings
        );
        if (!command) return;
        if (!message.member)
        await message.guild.members.fetch(message.author.id);

        if (command.ptb && this.client.build !== 'ptb')
            return message.error(message.translate('misc:PTB_ONLY'));

        const accessLevel = await this.client.helpers.fetchAccess.execute(
            message.guild
        );
        if (command.access && accessLevel.level < command.access) {
            return message.error(
                message.translate('misc:MISSING_ACCESS', {
                    command: command.access,
                    level: accessLevel.level,
                    title: accessLevel.title
                })
            );
        }

        if (
            !this.client.config.maintainers.includes(message.author.id) &&
            message.author.id !== message.guild.ownerID &&
            command.mode > 0 &&
            command.mode <
                (settings.mode === 'lite'
                    ? Constants.Modes.LITE
                    : Constants.Modes.STRICT)
        )
            return message.error(message.translate('misc:DISABLED'));

        if (
            userPermissions.level < command.permission ||
            (actualUserPermissions.level < command.permission &&
                actualUserPermissions.level !==
                    Constants.PermissionsLevels.SERVER_BLACKLISTED &&
                command.permission <= Constants.PermissionsLevels.SERVER_OWNER)
        ) {
            return message.error(
                this.client.helpers.permissionError.execute(
                    message,
                    command,
                    actualUserPermissions
                )
            );
        }

        return command.execute(message, params.join(' '), userPermissions);
    }

    matchPrefix(user: User, settings: GuildSettings, command: string) {
        if (
            command.startsWith(this.client.config.prefix) &&
            this.client.config.maintainers.includes(user.id)
        )
            return this.client.config.prefix;
        if (
            settings.prefix.custom &&
            command.startsWith(settings.prefix.custom)
        )
            return settings.prefix.custom;
        if (
            settings.prefix.default &&
            command.startsWith(this.client.config.prefix)
        )
            return this.client.config.prefix;

        return null;
    }

    inviteCheck(message: TypicalGuildMessage) {
        if (!message.guild.settings.automod.invite) return;
        const inviteRegex = /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i;
        if (
            inviteRegex.test(message.content) ||
            inviteRegex.test(inspect(message.embeds, { depth: 4 }))
        )
            this.client.emit('guildInvitePosted', message);
    }

    handleDM(message: Message) {
        if (!message.content.startsWith(this.client.config.prefix)) return;

        const command = this.client.commands.get(
            message.content
                .split(' ')[0]
                .slice(this.client.config.prefix.length)
        );

        if (
            !command ||
            !command.dm ||
            command.permission > Constants.PermissionsLevels.SERVER_MEMBER
        )
            return;

        command.execute(message);
    }
}
