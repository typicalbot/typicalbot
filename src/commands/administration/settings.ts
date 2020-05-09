import Command from '../../lib/structures/Command';
import { TypicalGuildMessage, SettingsData } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels, Links } from '../../lib/utils/constants';

const regex = /(list|view|edit|clear)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i;
const roleRegex = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i;
const msRegex = /^(\d+)$/i;
const channelRegex = /(?:(?:<#)?(\d{17,20})>?|(.+))/i;

const possibleLanguages = [
    {
        name: 'en-US',
        canonical: 'English',
        complete: true,
        aliases: ['en', 'english']
    },
    {
        name: 'fr-FR',
        canonical: 'French',
        complete: true,
        aliases: ['fr', 'french', 'française', 'français']
    },
    {
        name: 'de-DE',
        canonical: 'German',
        complete: false,
        aliases: ['de', 'german', 'deutsch', 'deutsche']
    },
    {
        name: 'sl-SL',
        canonical: 'Slovenian',
        complete: true,
        aliases: ['sl', 'slovenian']
    },
    {
        name: 'ru-RU',
        canonical: 'Russian',
        complete: false,
        aliases: ['ru', 'русский']
    },
    {
        name: 'sv-SE',
        canonical: 'Swedish',
        complete: false,
        aliases: ['se', 'svenska']
    },
    {
        name: 'tr-TR',
        canonical: 'Turkish',
        complete: false,
        aliases: ['tr', 'Türk']
    }
];

export default class extends Command {
    aliases = ['set'];
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        });

        const args = regex.exec(parameters);
        if (!args) return message.error(usageError);
        args.shift();

        const permission = await this.client.handlers.permissions.fetch(message.guild, message.author.id, true);

        // const accessLevel = await this.client.helpers.fetchAccess.execute(
        //     message.guild
        // );

        const [action, setting, type, value] = args;

        if (['edit', 'clear'].includes(action) && permission.level < 3)
            return message.error(this.client.helpers.permissionError.execute(message, this, permission, PermissionsLevels.SERVER_ADMINISTRATOR));

        switch (action) {
            case 'clear':
                return this.clear(message);
            case 'view':
            case 'list':
            case 'edit': {
                const settings = message.guild.settings;
                const settingsData = {
                    dmcommands: {
                        description: 'administration/settings:DMCOMMANDS',
                        value: settings.dm.commands,
                        type: 'boolean',
                        path: 'dm.commands'
                    },
                    embed: {
                        description: 'administration/settings:EMBED',
                        value: settings.embed,
                        type: 'boolean',
                        path: 'embed'
                    },
                    adminrole: {
                        description: 'administration/settings:ADMINROLE',
                        value: settings.roles.administrator,
                        type: 'roles',
                        path: 'roles.administrator'
                    },
                    modrole: {
                        description: 'administration/settings:MODROLE',
                        value: settings.roles.moderator,
                        type: 'roles',
                        path: 'roles.moderator'
                    },
                    muterole: {
                        description: 'administration/settings:MUTEROLE',
                        value: settings.roles.mute,
                        type: 'role',
                        path: 'roles.mute'
                    },
                    blacklistrole: {
                        description: 'administration/settings:BLACKLISTROLE',
                        value: settings.roles.blacklist,
                        type: 'roles',
                        path: 'roles.blacklist'
                    },
                    subscriberrole: {
                        description: 'administration/settings:SUBSCRIBERROLE',
                        value: settings.subscriber,
                        type: 'role',
                        path: 'subscriber'
                    },
                    autorole: {
                        description: 'administration/settings:AUTOROLE',
                        value: settings.auto.role.id,
                        type: 'role',
                        path: 'auto.role.id'
                    },
                    'autorole-bots': {
                        description: 'administration/settings:AUTOROLE-BOTS',
                        value: settings.auto.role.bots,
                        type: 'role',
                        path: 'auto.role.bots'
                    },
                    'autorole-delay': {
                        description: 'administration/settings:AUTOROLE-DELAY',
                        value: settings.auto.role.delay,
                        type: 'ms',
                        path: 'auto.role.delay'
                    },
                    'autorole-silent': {
                        description: 'administration/settings:AUTOROLE-SILENT',
                        value: settings.auto.role.silent,
                        type: 'boolean',
                        path: 'auto.role.silent'
                    },
                    announcements: {
                        description: 'administration/settings:ANNOUNCEMENTS',
                        value: settings.announcements.id,
                        type: 'channel',
                        path: 'announcements.id'
                    },
                    'announcements-mention': {
                        description:
                            'administration/settings:ANNOUNCEMENTS-MENTION',
                        value: settings.announcements.mention,
                        type: 'role',
                        path: 'announcements.mention'
                    },
                    logs: {
                        description: 'administration/settings:LOGS',
                        value: settings.logs.id,
                        type: 'channel',
                        path: 'logs.id'
                    },
                    'logs-join': {
                        description: 'administration/settings:LOGS-JOIN',
                        value: settings.logs.join,
                        type: 'log',
                        path: 'logs.join'
                    },
                    'logs-leave': {
                        description: 'administration/settings:LOGS-LEAVE',
                        value: settings.logs.leave,
                        type: 'log',
                        path: 'logs.leave'
                    },
                    'logs-ban': {
                        description: 'administration/settings:LOGS-BAN',
                        value: settings.logs.ban,
                        type: 'log',
                        path: 'logs.ban'
                    },
                    'logs-unban': {
                        description: 'administration/settings:LOGS-UNBAN',
                        value: settings.logs.unban,
                        type: 'log',
                        path: 'logs.unban'
                    },
                    'logs-nickname': {
                        description: 'administration/settings:LOGS-NICKNAME',
                        value: settings.logs.nickname,
                        type: 'log',
                        path: 'logs.nickname'
                    },
                    'logs-invite': {
                        description: 'administration/settings:LOGS-INVITE',
                        value: settings.logs.invite,
                        type: 'log',
                        path: 'logs.invite'
                    },
                    'logs-say': {
                        description: 'administration/settings:LOGS-SAY',
                        value: settings.logs.say,
                        type: 'log',
                        path: 'logs.say'
                    },
                    modlogs: {
                        description: 'administration/settings:MODLOGS',
                        value: settings.logs.moderation,
                        type: 'channel',
                        path: 'logs.moderation'
                    },
                    'modlogs-purge': {
                        description: 'administration/settings:MODLOGS-PURGE',
                        value: settings.logs.purge,
                        type: 'boolean',
                        path: 'logs.purge'
                    },
                    automessage: {
                        description: 'administration/settings:AUTOMESSAGE',
                        value: settings.auto.message,
                        type: 'default',
                        path: 'auto.message'
                    },
                    autonickname: {
                        description: 'administration/settings:AUTONICKNAME',
                        value: settings.auto.nickname,
                        type: 'default',
                        path: 'auto.nickname'
                    },
                    mode: {
                        description: 'administration/settings:MODE',
                        value: settings.mode,
                        type: 'default',
                        path: 'mode'
                    },
                    customprefix: {
                        description: 'administration/settings:CUSTOMPREFIX',
                        value: settings.prefix.custom,
                        type: 'default',
                        path: 'prefix.custom'
                    },
                    defaultprefix: {
                        description: 'administration/settings:DEFAULTPREFIX',
                        value: settings.prefix.default,
                        type: 'boolean',
                        path: 'prefix.default'
                    },
                    antiinvite: {
                        description: 'administration/settings:ANTIINVITE',
                        value: settings.automod.invite,
                        type: 'boolean',
                        path: 'automod.invite'
                    },
                    'antiinvite-action': {
                        description: 'administration/settings:ANTIINVITE-ACTION',
                        value: settings.automod.inviteaction,
                        type: 'boolean',
                        path: 'automod.inviteaction'
                    },
                    'antiinvite-warn': {
                        description: 'administration/settings:ANTIINVITE-WARN',
                        value: settings.automod.invitewarn,
                        type: 'default',
                        path: 'automod.invitewarn'
                    },
                    'antiinvite-kick': {
                        description: 'administration/settings:ANTIINVITE-KICK',
                        value: settings.automod.invitekick,
                        type: 'default',
                        path: 'automod.invitekick'
                    },
                    nonickname: {
                        description: 'administration/settings:NONICKNAME',
                        value: settings.nonickname,
                        type: 'boolean',
                        path: 'nonickname'
                    },
                    starboard: {
                        description: 'administration/settings:STARBOARD',
                        value: settings.starboard.id,
                        type: 'channel',
                        path: 'starboard.id'
                    },
                    'starboard-stars': {
                        description: 'administration/settings:STARBOARD-STARS',
                        value: settings.starboard.count,
                        type: 'default',
                        path: 'starboard.count'
                    },
                    language: {
                        description: 'administration/settings:LANGUAGE',
                        value: settings.language,
                        type: 'default',
                        path: 'language'
                    }
                };

                if (action === 'list')
                    return this.list(message, setting, settingsData);
                if (action === 'view' && (!setting || !isNaN(parseInt(setting, 10))))
                    return this.list(message, setting, settingsData, true);
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const selectedSetting = settingsData[setting];
                if (!selectedSetting)
                    return message.error(message.translate('administration/settings:INVALID'));

                if (action === 'view')
                    return this.view(message, selectedSetting);

                if (!value) return message.error(usageError);
                return this.edit(message, selectedSetting, value, type);
            }
        }

        return null;
    }


    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    list(message: TypicalGuildMessage, setting: string, settingsData, view = false) {
        let page = parseInt(setting, 10) || 1;
        const settings = Object.keys(settingsData);
        const count = Math.ceil(settings.length / 10);
        if (page < 1 || page > count) page = 1;

        const NA = message.translate('common:NA').toUpperCase()

        const list = settings
            .splice((page - 1) * 10, 10)
            .map((k) => {
                if (!view) return message.translate(settingsData[k].description)

                let response = ` • **${k}:** `
                const type = settingsData[k].type
                const value = settingsData[k].value

                if (type === 'channel') {
                    if (value && message.guild.channels.cache.has(value)) response += `<#${value}>`
                    else response += NA
                } else if (type === 'channels') {
                    if (value.length) response += value.map((id: string) => `<#${id}>`)
                    else response += NA
                } else if (type === 'role') {
                    const role = message.guild.roles.cache.get(value)
                    if (role) response += role.name
                    else response += NA
                } else if (type === 'roles') {
                    if (value.length) response += value.map((id: string) => message.guild.roles.cache.get(id)?.name || 'Unknown Role').join(', ')
                    else response += NA
                } else if (type === 'boolean') response += message.translate(value ? 'common:ENABLED' : 'common:DISABLED')
                else if (type === 'log' && value === '--embed') response += 'Embed'
                else response += value || NA

                return response
            });

        return message.send([
            message.translate('administration/settings:AVAILABLE'),
            '',
            message.translate('administration/settings:PAGE', { page, count }),
            list.join('\n'),
            message.translate('administration/settings:USAGE_LIST')
        ].join('\n'));
    }

    async clear(message: TypicalGuildMessage) {
        const deleted = await this.client.handlers.database
            .delete('guilds', message.guild.id)
            .catch(() => null);

        this.client.settings.delete(message.guild.id);

        return deleted
            ? message.reply(message.translate('administration/settings:CLEARED'))
            : message.error(message.translate('administration/settings:CLEAR_ERROR'));
    }

    view(message: TypicalGuildMessage, setting: SettingsData) {
        const NONE = message.translate('common:NONE');

        if (setting.type === 'boolean') {
            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: message.translate(setting.value ? 'common:ENABLED' : 'common:DISABLED')
            }));
        }

        if (setting.type === 'roles') {
            const list = [];
            for (const roleID of setting.value as string[]) {
                const role = message.guild.roles.cache.get(roleID);
                if (!role) continue;

                list.push(`*${
                    message.guild.id === roleID
                        ? role.name.slice(1)
                        : role.name
                }*`);
            }
            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: list.length ? list.join(', ') : NONE
            }));
        }

        if (setting.type === 'role') {
            const role = message.guild.roles.cache.get(setting.value as string);
            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: role ? role.name : NONE
            }));
        }

        if (setting.type === 'ms') {
            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: setting.value
                    ? `${setting.value}ms`
                    : message.translate('common:DEFAULT')
            }));
        }

        if (setting.type === 'channel') {
            const channel = message.guild.channels.cache.get(setting.value as string);
            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: channel ? channel.toString() : NONE
            }));
        }

        if (setting.type === 'log') {
            const disabled = setting.value === '--disabled';
            const embed = setting.value === '--embed';
            const logText = !setting.value
                ? message.translate('common:DEFAULT')
                : disabled
                    ? message.translate('common:DISABLED')
                    : embed
                        ? message.translate('common:EMBED')
                        : ['```txt', '', setting.value, '```'].join('\n');

            return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
                value: logText
            }));
        }

        return message.reply(message.translate('administration/settings:CURRENT_VALUE', {
            value: setting.value || NONE
        }));
    }

    async edit(message: TypicalGuildMessage, setting: SettingsData, value: string, type: string) {
        let payload = {};
        const ENABLE = message.translate('common:ENABLE').toLowerCase();
        const DISABLE = message.translate('common:DISABLE').toLowerCase();
        const ADD = message.translate('common:ADD').toLowerCase();
        const CLEAR = message.translate('common:CLEAR').toLowerCase();
        const REMOVE = message.translate('common:REMOVE').toLowerCase();
        const DEFAULT = message.translate('common:DEFAULT');
        const HERE = message.translate('common:HERE');
        const EMBED = message.translate('common:EMBED');

        if (setting.path.endsWith('language')) {
            const selectedLanguage = possibleLanguages.find((data) =>
                data.name === value.toLowerCase() ||
                data.aliases.includes(value.toLowerCase()));
            if (!selectedLanguage)
                return message.error(message.translate('administration/settings:INVALID_OPTION'));

            if (!selectedLanguage.complete)
                await message.reply(`${selectedLanguage.canonical} is not fully translated yet. You can help translate TypicalBot at <${Links.TRANSLATE}>`);

            value = selectedLanguage.name;
        }

        if (setting.path === 'auto.role.id' || setting.path === 'auto.role.delay')
            if (message.guild.verificationLevel === 'VERY_HIGH')
                return message.error(message.translate('administration/settings:VERIFICATION_LEVEL_VERYHIGH'));

        if (setting.type === 'boolean') {
            if (![DISABLE, ENABLE, 'enable', 'disable'].includes(value.toLowerCase()))
                return message.error(message.translate('administration/settings:INVALID_OPTION'));

            const enableSetting = ['enable', ENABLE].includes(value.toLowerCase());

            payload = this.stringToObject(setting.path, enableSetting);
        }

        if (setting.type === 'roles') {
            if ([DISABLE, 'disable', CLEAR, 'clear'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, []);
            } else if (type && [ADD, 'add', REMOVE, 'remove'].includes(type.toLowerCase())) {
                const args = roleRegex.exec(value);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: this.client.config.prefix
                    }));
                args.shift();

                const [roleID, roleName] = args;

                const role = roleID
                    ? message.guild.roles.cache.get(roleID)
                    : message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());

                if (!role)
                    return message.error(message.translate('moderation/give:INVALID'));

                const isAdd = [ADD, 'add'].includes(type.toLowerCase());

                if (isAdd && (setting.value as string[]).includes(role.id))
                    return message.error(message.translate('administration/settings:ROLE_EXISTS'));
                if (!isAdd && !(setting.value as string[]).includes(role.id))
                    return message.error(message.translate('administration/settings:ROLE_NOT_SET'));

                const newValue = isAdd
                    ? [...(setting.value as string[]), role.id]
                    : (setting.value as string[]).filter((id) => id !== role.id);

                payload = this.stringToObject(setting.path, newValue);
            } else {
                return message.error(message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                }));
            }
        }

        if (setting.type === 'role') {
            if ([DISABLE, 'disable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = roleRegex.exec(value);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: this.client.config.prefix
                    }));
                args.shift();

                const [roleID, roleName] = args;

                const role = roleID
                    ? message.guild.roles.cache.get(roleID)
                    : message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());

                if (!role)
                    return message.error(message.translate('moderation/give:INVALID'));

                payload = this.stringToObject(setting.path, role.id);
            }
        }

        if (setting.type === 'ms') {
            if ([DISABLE, 'disable', DEFAULT, 'default'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = msRegex.exec(value);
                if (!args)
                    return message.error(message.translate('administration/settings:INVALID_MS'));
                args.shift();

                const [ms] = args;
                const amount = parseInt(ms, 10);

                if (setting.path === 'auto.role.delay')
                    if (message.guild.verificationLevel === 'HIGH' && amount < 60000)
                        return message.error(message.translate('administration/settings:VERIFICATION_LEVEL_HIGH'));

                if (amount > 600000 || amount < 2000)
                    return message.error(message.translate('administration/settings:INVALID_MS'));

                payload = this.stringToObject(setting.path, amount);
            }
        }

        if (setting.type === 'channel') {
            if ([DISABLE, 'disable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else if ([HERE, 'here'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, message.channel.id);
            } else {
                const args = channelRegex.exec(value);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: this.client.config.prefix
                    }));
                args.shift();

                const [channelID, channelName] = args;

                const channel = channelID
                    ? message.guild.channels.cache.get(channelID)
                    : message.guild.channels.cache.find((r) =>
                        r.name.toLowerCase() === channelName.toLowerCase());

                if (!channel)
                    return message.error(message.translate('administration/settings:INVALID_CHANNEL'));
                if (channel.type !== 'text')
                    return message.error(message.translate('administration/settings:NOT_TEXT_CHANNEL'));

                payload = this.stringToObject(setting.path, channel.id);
            }
        }

        if (setting.type === 'log') {
            if (!message.guild.settings.logs.id)
                return message.error(message.translate('administration/settings:NEED_LOG'));

            if ([DISABLE, 'disable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--disabled');
            } else if ([DEFAULT, 'default', ENABLE, 'enable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else if ([EMBED, 'embed'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--embed');
            } else {
                payload = this.stringToObject(setting.path, value);
            }
        }

        if (setting.type === 'default') {
            payload = this.stringToObject(setting.path, [DISABLE, 'disable'].includes(value.toLowerCase())
                ? null
                : value);
        }

        await this.client.settings.update(message.guild.id, payload);

        return message.success(message.translate('administration/settings:UPDATED'));
    }

    stringToObject(path: string, value: unknown): {} {
        if (!path.includes('.')) return { [path]: value };
        const parts = path.split('.');
        return {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            [parts.shift()]: this.stringToObject(parts.join('.'), value)
        };
    }
}
