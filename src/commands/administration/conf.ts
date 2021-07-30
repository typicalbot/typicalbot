import Command from '../../lib/structures/Command';
import { TypicalGuildMessage, SettingsData } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL, LINK } from '../../lib/utils/constants';

const roleRegex = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i;
const msRegex = /^(\d+)$/i;
const channelRegex = /(?:(?:<#)?(\d{17,20})>?|(.+))/i;

export const possibleLanguages = [
    {
        name: 'bg-BG',
        canonical: 'Bulgarian',
        complete: false,
        aliases: ['bg', 'bulgarian']
    },
    {
        name: 'de-DE',
        canonical: 'German',
        complete: false,
        aliases: ['de', 'german']
    },
    {
        name: 'en-US',
        canonical: 'English',
        complete: true,
        aliases: ['en', 'english']
    },
    {
        name: 'es-ES',
        canonical: 'Spanish',
        complete: false,
        aliases: ['es', 'spanish']
    },
    {
        name: 'fr-FR',
        canonical: 'French',
        complete: true,
        aliases: ['fr', 'french']
    },
    {
        name: 'pl-PL',
        canonical: 'Polish',
        complete: false,
        aliases: ['pl', 'polish']
    },
    {
        name: 'ru-RU',
        canonical: 'Russian',
        complete: false,
        aliases: ['ru', 'russian']
    },
    {
        name: 'sl-SL',
        canonical: 'Slovenian',
        complete: true,
        aliases: ['sl', 'slovenian']
    },
    {
        name: 'sv-SE',
        canonical: 'Swedish',
        complete: false,
        aliases: ['se', 'swedish']
    },
    {
        name: 'tr-TR',
        canonical: 'Turkish',
        complete: true,
        aliases: ['tr', 'turkish']
    }
];

export default class extends Command {
    aliases = ['set', 'settings'];
    mode = MODE.STRICT;
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const [setting, value] = parameters.split(/(?<=^\S+)\s/);

        const settings = message.guild.settings;
        const settingsData = {
            dmcommands: {
                description: 'administration/conf:DMCOMMANDS',
                value: settings.dm.commands,
                type: 'boolean',
                path: 'dm.commands'
            },
            embed: {
                description: 'administration/conf:EMBED',
                value: settings.embed,
                type: 'boolean',
                path: 'embed'
            },
            adminrole: {
                description: 'administration/conf:ADMINROLE',
                value: settings.roles.administrator,
                type: 'roles',
                path: 'roles.administrator'
            },
            modrole: {
                description: 'administration/conf:MODROLE',
                value: settings.roles.moderator,
                type: 'roles',
                path: 'roles.moderator'
            },
            muterole: {
                description: 'administration/conf:MUTEROLE',
                value: settings.roles.mute,
                type: 'role',
                path: 'roles.mute'
            },
            blacklistrole: {
                description: 'administration/conf:BLACKLISTROLE',
                value: settings.roles.blacklist,
                type: 'roles',
                path: 'roles.blacklist'
            },
            subscriberrole: {
                description: 'administration/conf:SUBSCRIBERROLE',
                value: settings.subscriber,
                type: 'role',
                path: 'subscriber'
            },
            autorole: {
                description: 'administration/conf:AUTOROLE',
                value: settings.auto.role.id,
                type: 'role',
                path: 'auto.role.id'
            },
            'autorole-bots': {
                description: 'administration/conf:AUTOROLE-BOTS',
                value: settings.auto.role.bots,
                type: 'role',
                path: 'auto.role.bots'
            },
            'autorole-delay': {
                description: 'administration/conf:AUTOROLE-DELAY',
                value: settings.auto.role.delay,
                type: 'ms',
                path: 'auto.role.delay'
            },
            'autorole-silent': {
                description: 'administration/conf:AUTOROLE-SILENT',
                value: settings.auto.role.silent,
                type: 'boolean',
                path: 'auto.role.silent'
            },
            announcements: {
                description: 'administration/conf:ANNOUNCEMENTS',
                value: settings.announcements.id,
                type: 'channel',
                path: 'announcements.id'
            },
            'announcements-mention': {
                description:
                    'administration/conf:ANNOUNCEMENTS-MENTION',
                value: settings.announcements.mention,
                type: 'role',
                path: 'announcements.mention'
            },
            logs: {
                description: 'administration/conf:LOGS',
                value: settings.logs.id,
                type: 'channel',
                path: 'logs.id'
            },
            'logs-join': {
                description: 'administration/conf:LOGS-JOIN',
                value: settings.logs.join,
                type: 'log',
                path: 'logs.join'
            },
            'logs-leave': {
                description: 'administration/conf:LOGS-LEAVE',
                value: settings.logs.leave,
                type: 'log',
                path: 'logs.leave'
            },
            'logs-ban': {
                description: 'administration/conf:LOGS-BAN',
                value: settings.logs.ban,
                type: 'log',
                path: 'logs.ban'
            },
            'logs-unban': {
                description: 'administration/conf:LOGS-UNBAN',
                value: settings.logs.unban,
                type: 'log',
                path: 'logs.unban'
            },
            'logs-nickname': {
                description: 'administration/conf:LOGS-NICKNAME',
                value: settings.logs.nickname,
                type: 'log',
                path: 'logs.nickname'
            },
            'logs-invite': {
                description: 'administration/conf:LOGS-INVITE',
                value: settings.logs.invite,
                type: 'log',
                path: 'logs.invite'
            },
            'logs-say': {
                description: 'administration/conf:LOGS-SAY',
                value: settings.logs.say,
                type: 'log',
                path: 'logs.say'
            },
            'logs-slowmode': {
                description: 'administration/conf:LOGS-SLOWMODE',
                value: settings.logs.slowmode,
                type: 'log',
                path: 'logs.slowmode'
            },
            modlogs: {
                description: 'administration/conf:MODLOGS',
                value: settings.logs.moderation,
                type: 'channel',
                path: 'logs.moderation'
            },
            'modlogs-purge': {
                description: 'administration/conf:MODLOGS-PURGE',
                value: settings.logs.purge,
                type: 'boolean',
                path: 'logs.purge'
            },
            automessage: {
                description: 'administration/conf:AUTOMESSAGE',
                value: settings.auto.message,
                type: 'default',
                path: 'auto.message'
            },
            autonickname: {
                description: 'administration/conf:AUTONICKNAME',
                value: settings.auto.nickname,
                type: 'default',
                path: 'auto.nickname'
            },
            mode: {
                description: 'administration/conf:MODE',
                value: settings.mode,
                type: 'default',
                path: 'mode'
            },
            customprefix: {
                description: 'administration/conf:CUSTOMPREFIX',
                value: settings.prefix.custom,
                type: 'default',
                path: 'prefix.custom'
            },
            defaultprefix: {
                description: 'administration/conf:DEFAULTPREFIX',
                value: settings.prefix.default,
                type: 'boolean',
                path: 'prefix.default'
            },
            'antispam-mentions': {
                description: 'administration/conf:ANTISPAM-MENTIONS',
                value: settings.automod.spam.mentions.enabled,
                type: 'boolean',
                path: 'automod.spam.mentions.enabled'
            },
            'antispam-mentions-severity': {
                description: 'administration/conf:ANTISPAM-MENTIONS-SEVERITY',
                value: settings.automod.spam.mentions.severity,
                type: 'default',
                path: 'automod.spam.mentions.severity'
            },
            'antispam-caps': {
                description: 'administration/conf:ANTISPAM-CAPS',
                value: settings.automod.spam.caps.enabled,
                type: 'boolean',
                path: 'automod.spam.caps.enabled'
            },
            'antispam-caps-severity': {
                description: 'administration/conf:ANTISPAM-CAPS-SEVERITY',
                value: settings.automod.spam.caps.severity,
                type: 'default',
                path: 'automod.spam.caps.severity'
            },
            'antispam-zalgo': {
                description: 'administration/conf:ANTISPAM-ZALGO',
                value: settings.automod.spam.zalgo.enabled,
                type: 'boolean',
                path: 'automod.spam.zalgo.enabled'
            },
            'antispam-zalgo-severity': {
                description: 'administration/conf:ANTISPAM-ZALGO-SEVERITY',
                value: settings.automod.spam.zalgo.severity,
                type: 'default',
                path: 'automod.spam.zalgo.severity'
            },
            antiinvite: {
                description: 'administration/conf:ANTIINVITE',
                value: settings.automod.invite,
                type: 'boolean',
                path: 'automod.invite'
            },
            'antiinvite-action': {
                description: 'administration/conf:ANTIINVITE-ACTION',
                value: settings.automod.inviteaction,
                type: 'boolean',
                path: 'automod.inviteaction'
            },
            'antiinvite-warn': {
                description: 'administration/conf:ANTIINVITE-WARN',
                value: settings.automod.invitewarn,
                type: 'default',
                path: 'automod.invitewarn'
            },
            'antiinvite-kick': {
                description: 'administration/conf:ANTIINVITE-KICK',
                value: settings.automod.invitekick,
                type: 'default',
                path: 'automod.invitekick'
            },
            nonickname: {
                description: 'administration/conf:NONICKNAME',
                value: settings.nonickname,
                type: 'boolean',
                path: 'nonickname'
            },
            starboard: {
                description: 'administration/conf:STARBOARD',
                value: settings.starboard.id,
                type: 'channel',
                path: 'starboard.id'
            },
            'starboard-stars': {
                description: 'administration/conf:STARBOARD-STARS',
                value: settings.starboard.count,
                type: 'default',
                path: 'starboard.count'
            },
            language: {
                description: 'administration/conf:LANGUAGE',
                value: settings.language,
                type: 'default',
                path: 'language'
            }
        };

        if (!setting || /^\d+$/.test(setting)) {
            return this.list(message, setting, settingsData);
        }

        if (setting === 'clear') {
            return this.clear(message);
        }

        // @ts-ignore
        const selectedSetting = settingsData[setting];
        if (!selectedSetting) {
            return message.error(message.translate('administration/conf:INVALID'));
        }

        if (setting && !value) {
            return this.view(message, selectedSetting);
        }

        return this.edit(message, selectedSetting, value);
    }

    // @ts-ignore
    list(message: TypicalGuildMessage, setting: string, settingsData, view = false) {
        let page = parseInt(setting, 10) || 1;
        const settings = Object.keys(settingsData);
        const count = Math.ceil(settings.length / 10);
        if (page < 1 || page > count) page = 1;

        const NA = message.translate('common:NA').toUpperCase();

        const list = settings
            .splice((page - 1) * 10, 10)
            .map((k) => {
                if (!view) return `• **${k}:** ${message.translate(settingsData[k].description)}`;

                let response = ` • **${k}:** `;
                const type = settingsData[k].type;
                const value = settingsData[k].value;

                if (type === 'channel') {
                    if (value && message.guild.channels.cache.has(value)) response += `<#${value}>`;
                    else response += NA;
                } else if (type === 'channels') {
                    if (value.length) response += value.map((id: string) => `<#${id}>`);
                    else response += NA;
                } else if (type === 'role') {
                    const role = message.guild.roles.cache.get(value);
                    if (role) response += role.name;
                    else response += NA;
                } else if (type === 'roles') {
                    if (value.length)
                        response += value.map((id: string) => message.guild.roles.cache.get(id)?.name ?? 'Unknown Role')
                            .join(', ');
                    else response += NA;
                } else if (type === 'boolean')
                    response += message.translate(value ? 'common:ENABLED' : 'common:DISABLED');
                else if (type === 'log' && value === '--embed') response += 'Embed';
                else response += value || NA;

                return response;
            });

        return message.send([
            message.translate('administration/conf:AVAILABLE'),
            '',
            message.translate('administration/conf:PAGE', { page, count }),
            list.join('\n'),
            '',
            message.translate('administration/conf:USAGE_LIST', { prefix: process.env.PREFIX })
        ].join('\n'));
    }

    async clear(message: TypicalGuildMessage) {
        const deleted = await this.client.database
            .delete('guilds', { id: message.guild.id });

        this.client.settings.delete(message.guild.id);

        return deleted
            ? message.reply(message.translate('administration/conf:CLEARED'))
            : message.error(message.translate('administration/conf:CLEAR_ERROR'));
    }

    view(message: TypicalGuildMessage, setting: SettingsData) {
        const NONE = message.translate('common:NONE');

        if (setting.type === 'boolean') {
            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
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
            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
                value: list.length ? list.join(', ') : NONE
            }));
        }

        if (setting.type === 'role') {
            const role = message.guild.roles.cache.get(setting.value as string);
            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
                value: role ? role.name : NONE
            }));
        }

        if (setting.type === 'ms') {
            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
                value: setting.value
                    ? `${setting.value}ms`
                    : message.translate('common:DEFAULT')
            }));
        }

        if (setting.type === 'channel') {
            const channel = message.guild.channels.cache.get(setting.value as string);
            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
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

            return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
                value: logText
            }));
        }

        return message.reply(message.translate('administration/conf:CURRENT_VALUE', {
            value: setting.value || NONE
        }));
    }

    async edit(message: TypicalGuildMessage, setting: SettingsData, value: string) {
        let payload;
        const HERE = message.translate('common:HERE');
        const EMBED = message.translate('common:EMBED');

        const english = this.client.translate.get('en-US');
        const ENABLE_OPTIONS = message.translate('common:ENABLE_OPTIONS', { returnObjects: true });
        const ENGLISH_ENABLE_OPTIONS = english!('common:ENABLE_OPTIONS', { returnObjects: true });
        const DISABLE_OPTIONS = message.translate('common:DISABLE_OPTIONS', { returnObjects: true });
        const ENGLISH_DISABLE_OPTIONS = english!('common:DISABLE_OPTIONS', { returnObjects: true });

        if (setting.path.endsWith('language')) {
            const selectedLanguage = possibleLanguages.find((data) =>
                data.name === value.toLowerCase() ||
                data.aliases.includes(value.toLowerCase()));
            if (!selectedLanguage)
                return message.error(message.translate('administration/conf:INVALID_OPTION'));

            if (!selectedLanguage.complete) {
                // eslint-disable-next-line max-len
                await message.reply(`${selectedLanguage.canonical} is not fully translated yet. You can help translate TypicalBot at <${LINK.TRANSLATE}>`);
            }

            value = selectedLanguage.name;
        }

        if (setting.path === 'auto.role.id' || setting.path === 'auto.role.delay')
            if (message.guild.verificationLevel === 'VERY_HIGH')
                return message.error(message.translate('administration/conf:VERIFICATION_LEVEL_VERYHIGH'));

        if (setting.type === 'boolean') {
            if (![...ENABLE_OPTIONS, ...ENGLISH_ENABLE_OPTIONS, ...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase()))
                return message.error(message.translate('administration/conf:INVALID_OPTION'));

            const enableSetting = [...ENABLE_OPTIONS, ...ENGLISH_ENABLE_OPTIONS].includes(value.toLowerCase());

            payload = this.stringToObject(setting.path, enableSetting);
        }

        if (setting.type === 'roles') {
            if ([...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, []);
            } else {
                const args = roleRegex.exec(value.split(/(?<=^\S+)\s/)[1]);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: process.env.PREFIX
                    }));
                args.shift();

                const [roleID, roleName] = args;

                const role = roleID
                    ? message.guild.roles.cache.get(roleID)
                    : message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());

                if (!role)
                    return message.error(message.translate('moderation/give:INVALID'));

                const currentValue = setting.value as string[];
                const newValue = !currentValue.includes(role.id)
                    ? [...currentValue, role.id]
                    : currentValue.filter((id) => id !== role.id);

                payload = this.stringToObject(setting.path, newValue);
            }
        }

        if (setting.type === 'role') {
            if ([...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = roleRegex.exec(value);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: process.env.PREFIX
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
            if ([...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = msRegex.exec(value);
                if (!args)
                    return message.error(message.translate('administration/conf:INVALID_MS'));
                args.shift();

                const [ms] = args;
                const amount = parseInt(ms, 10);

                if (setting.path === 'auto.role.delay')
                    if (message.guild.verificationLevel === 'HIGH' && amount < 60000)
                        return message.error(message.translate('administration/conf:VERIFICATION_LEVEL_HIGH'));

                if (amount > 600000 || amount < 2000)
                    return message.error(message.translate('administration/conf:INVALID_MS'));

                payload = this.stringToObject(setting.path, amount);
            }
        }

        if (setting.type === 'channel') {
            if ([...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else if ([HERE, 'here'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, message.channel.id);
            } else {
                const args = channelRegex.exec(value);
                if (!args)
                    return message.error(message.translate('misc:USAGE_ERROR', {
                        name: this.name,
                        prefix: process.env.PREFIX
                    }));
                args.shift();

                const [channelID, channelName] = args;

                const channel = channelID
                    ? message.guild.channels.cache.get(channelID)
                    : message.guild.channels.cache.find((r) =>
                        r.name.toLowerCase() === channelName.toLowerCase());

                if (!channel)
                    return message.error(message.translate('administration/conf:INVALID_CHANNEL'));
                if (channel.type !== 'text' && channel.type !== 'news')
                    return message.error(message.translate('administration/conf:NOT_TEXT_CHANNEL'));

                payload = this.stringToObject(setting.path, channel.id);
            }
        }

        if (setting.type === 'log') {
            if (!message.guild.settings.logs.id)
                return message.error(message.translate('administration/conf:NEED_LOG'));

            if ([...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--disabled');
            } else if ([...ENABLE_OPTIONS, ...ENGLISH_ENABLE_OPTIONS].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else if ([EMBED, 'embed'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--embed');
            } else {
                payload = this.stringToObject(setting.path, value);
            }
        }

        if (setting.type === 'default') {
            payload = this.stringToObject(setting.path, [...DISABLE_OPTIONS, ...ENGLISH_DISABLE_OPTIONS].includes(value.toLowerCase())
                ? null
                : value);
        }

        // TODO: This is a temporary fix
        await this.client.settings.update(message.guild.id, setting.path, payload);

        return message.success(message.translate('administration/conf:UPDATED'));
    }

    // TODO: This is a temporary fix
    // eslint-disable-next-line @typescript-eslint/ban-types
    stringToObject(path: string, value: unknown) {
        // if (!path.includes('.')) return { [path]: value };
        // const parts = path.split('.');
        // return {
        //     @ts-ignore
        // [parts.shift()]: this.stringToObject(parts.join('.'), value)
        // };
        return value;
    }
}
