// TODO: add a setting to change language

import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage, SettingsData } from '../../types/typicalbot';

const regex = /(list|view|edit)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i;
const roleRegex = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i;
const msRegex = /^(\d+)$/i;
const channelRegex = /(?:(?:<#)?(\d{17,20})>?|(.+))/i;

export default class extends Command {
    aliases = ['set'];
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        });

        const args = regex.exec(parameters);
        if (!args) return message.error(usageError);
        args.shift();

        const permission = await this.client.handlers.permissions.fetch(
            message.guild,
            message.author.id,
            true
        );

        // const accessLevel = await this.client.helpers.fetchAccess.execute(
        //     message.guild
        // );

        const [action, setting, type, value] = args;
        console.log('type', type);
        if (['edit', 'clear'].includes(action) && permission.level < 3)
            return message.error(
                this.client.helpers.permissionError.execute(
                    message,
                    this,
                    permission
                )
            );

        switch (action) {
            case 'clear':
                return this.clear(message);
            case 'view':
            case 'list':
            case 'edit': {
                const settings = message.guild.settings;
                const settingsData = {
                    embed: {
                        description: 'settings:EMBED',
                        value: settings.embed,
                        type: 'boolean',
                        path: 'embed'
                    },
                    adminrole: {
                        description: 'settings:ADMINROLE',
                        value: settings.roles.administrator,
                        type: 'roles',
                        path: 'roles.administrator'
                    },
                    modrole: {
                        description: 'settings:MODROLE',
                        value: settings.roles.moderator,
                        type: 'roles',
                        path: 'roles.moderator'
                    },
                    djrole: {
                        description: 'settings:DJROLE',
                        value: settings.roles.dj,
                        type: 'roles',
                        path: 'roles.dj'
                    },
                    muterole: {
                        description: 'settings:MUTEROLE',
                        value: settings.roles.mute,
                        type: 'role',
                        path: 'roles.mute'
                    },
                    blacklistrole: {
                        description: 'settings:BLACKLISTROLE',
                        value: settings.roles.blacklist,
                        type: 'roles',
                        path: 'roles.blacklist'
                    },
                    subscriberrole: {
                        description: 'settings:SUBSCRIBERROLE',
                        value: settings.subscriber,
                        type: 'role',
                        path: 'subscriber'
                    },
                    autorole: {
                        description: 'settings:AUTOROLE',
                        value: settings.auto.role.id,
                        type: 'role',
                        path: 'auto.role.id'
                    },
                    'autorole-bots': {
                        description: 'settings:AUTOROLE-BOTS',
                        value: settings.auto.role.bots,
                        type: 'role',
                        path: 'auto.role.bots'
                    },
                    'autorole-delay': {
                        description: 'settings:AUTOROLE-DELAY',
                        value: settings.auto.role.delay,
                        type: 'ms'
                    },
                    'autorole-silent': {
                        description: 'settings:AUTOROLE-SILENT',
                        value: settings.auto.role.silent,
                        type: 'boolean',
                        path: 'auto.role.silent'
                    },
                    announcements: {
                        description: 'settings:ANNOUNCEMENTS',
                        value: settings.announcements.id,
                        type: 'channel',
                        path: 'announcements.id'
                    },
                    'announcements-mention': {
                        description: 'settings:ANNOUNCEMENTS-MENTION',
                        value: settings.announcements.mention,
                        type: 'role',
                        path: 'announcements.mention'
                    },
                    logs: {
                        description: 'settings:LOGS',
                        value: settings.logs.id,
                        type: 'channel',
                        path: 'logs.id'
                    },
                    'logs-join': {
                        description: 'settings:LOGS-JOIN',
                        value: settings.logs.join,
                        type: 'log',
                        path: 'logs.join'
                    },
                    'logs-leave': {
                        description: 'settings:LOGS-LEAVE',
                        value: settings.logs.leave,
                        type: 'log',
                        path: 'logs.leave'
                    },
                    'logs-ban': {
                        description: 'settings:LOGS-BAN',
                        value: settings.logs.ban,
                        type: 'log',
                        path: 'logs.ban'
                    },
                    'logs-unban': {
                        description: 'settings:LOGS-UNBAN',
                        value: settings.logs.unban,
                        type: 'log',
                        path: 'logs.unban'
                    },
                    'logs-nickname': {
                        description: 'settings:LOGS-NICKNAME',
                        value: settings.logs.nickname,
                        type: 'log',
                        path: 'logs.nickname'
                    },
                    'logs-invite': {
                        description: 'settings:LOGS-INVITE',
                        value: settings.logs.invite,
                        type: 'log',
                        path: 'logs.invite'
                    },
                    'logs-say': {
                        description: 'settings:LOGS-SAY',
                        value: settings.logs.say,
                        type: 'log',
                        path: 'logs.say'
                    },
                    modlogs: {
                        description: 'settings:MODLOGS',
                        value: settings.logs.moderation,
                        type: 'channel',
                        path: 'logs.moderation'
                    },
                    'modlogs-purge': {
                        description: 'settings:MODLOGS-PURGE',
                        value: settings.logs.purge,
                        type: 'boolean',
                        path: 'logs.purge'
                    },
                    automessage: {
                        description: 'settings:AUTOMESSAGE',
                        value: settings.auto.message,
                        type: 'default',
                        path: 'auto.message'
                    },
                    autonickname: {
                        description: 'settings:AUTONICKNAME',
                        value: settings.auto.nickname,
                        type: 'default',
                        path: 'auto.nickname'
                    },
                    mode: {
                        description: 'settings:MODE',
                        value: settings.mode,
                        type: 'default',
                        path: 'mode'
                    },
                    customprefix: {
                        description: 'settings:CUSTOMPREFIX',
                        value: settings.prefix.custom,
                        type: 'default',
                        path: 'prefix.custom'
                    },
                    defaultprefix: {
                        description: 'settings:DEFAULTPREFIX',
                        value: settings.prefix.default,
                        type: 'default',
                        path: 'prefix.default'
                    },
                    antiinvite: {
                        description: 'settings:ANTIINVITE',
                        value: settings.automod.invite,
                        type: 'boolean',
                        path: 'automod.invite'
                    },
                    'antiinvite-action': {
                        description: 'settings:ANTIINVITE-ACTION',
                        value: settings.automod.inviteaction,
                        type: 'boolean',
                        path: 'automod.inviteaction'
                    },
                    'antiinvite-warn': {
                        description: 'settings:ANTIINVITE-WARN',
                        value: settings.automod.invitewarn,
                        type: 'default',
                        path: 'automod.invitewarn'
                    },
                    'antiinvite-kick': {
                        description: 'settings:ANTIINVITE-KICK',
                        value: settings.automod.invitekick,
                        type: 'default',
                        path: 'automod.invitekick'
                    },
                    nonickname: {
                        description: 'settings:NONICKNAME',
                        value: settings.nonickname,
                        type: 'boolean',
                        path: 'nonickname'
                    },
                    'music-permissions': {
                        description: 'settings:MUSIC-PERMISSIONS',
                        value: settings.music.default,
                        type: 'default',
                        path: 'music.default'
                    },
                    'music-play': {
                        description: 'settings:MUSIC-PLAY',
                        value: settings.music.play,
                        type: 'default',
                        path: 'music.play'
                    },
                    'music-skip': {
                        description: 'settings:MUSIC-SKIP',
                        value: settings.music.skip,
                        type: 'default',
                        path: 'music.skip'
                    },
                    'music-stop': {
                        description: 'settings:MUSIC-STOP',
                        value: settings.music.stop,
                        type: 'default',
                        path: 'music.stop'
                    },
                    'music-pause': {
                        description: 'settings:MUSIC-PAUSE',
                        value: settings.music.pause,
                        type: 'default',
                        path: 'music.pause'
                    },
                    'music-resume': {
                        description: 'settings:MUSIC-RESUME',
                        value: settings.music.resume,
                        type: 'default',
                        path: 'music.resume'
                    },
                    'music-unqueue': {
                        description: 'settings:MUSIC-UNQUEUE',
                        value: settings.music.unqueue,
                        type: 'default',
                        path: 'music.unqueue'
                    },
                    'music-volume': {
                        description: 'settings:MUSIC-VOLUME',
                        value: settings.music.volume,
                        type: 'default',
                        path: 'music.volume'
                    },
                    'music-timelimit': {
                        description: 'settings:MUSIC-TIMELIMIT',
                        value: settings.music.timelimit,
                        type: 'default',
                        path: 'music.timelimit'
                    },
                    'music-queuelimit': {
                        description: 'settings:MUSIC-QUEUELIMIT',
                        value: settings.music.queuelimit,
                        type: 'default',
                        path: 'music.queuelimit'
                    },
                    starboard: {
                        description: 'settings:STARBOARD',
                        value: settings.starboard.id,
                        type: 'channel',
                        path: 'starboard.id'
                    },
                    'starboard-stars': {
                        description: 'settings: STARBOARD-STARS',
                        value: settings.starboard.count,
                        type: 'default',
                        path: 'starboard.count'
                    }
                };

                if (action === 'list')
                    return this.list(message, setting, settingsData);
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const selectedSetting = settingsData[setting];
                if (!selectedSetting)
                    return message.translate('settings:INVALID');

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
    list(message: TypicalGuildMessage, setting: string, settingsData) {
        let page = parseInt(setting, 10) || 1;
        const settings = Object.keys(settingsData);
        const count = Math.ceil(settings.length / 10);
        if (page < 1 || page > count) page = 1;

        const list = settings
            .splice((page - 1) * 10, 10)
            .map(k => ` • **${k}:** ${message.translate(settingsData[k])}`);

        return message.send(
            [
                message.translate('settings:AVAILABLE'),
                '',
                '',
                message.translate('settings:PAGE', { page, count }),
                list.join('\n')
            ].join('\n')
        );
    }

    async clear(message: TypicalGuildMessage) {
        const deleted = await this.client.handlers.database
            .delete('guilds', message.guild.id)
            .catch(() => null);

        this.client.settings.delete(message.guild.id);

        return deleted
            ? message.reply(message.translate('settings:CLEARED'))
            : message.error(message.translate('settings:CLEAR_ERROR'));
    }

    view(message: TypicalGuildMessage, setting: SettingsData) {
        const NONE = message.translate('common:NONE');

        if (setting.type === 'boolean') {
            return message.reply(
                message.translate('settings:CURRENT_VALUE', {
                    value: message.translate(
                        setting.value ? 'common:ENABLED' : 'common:DISABLED'
                    )
                })
            );
        }

        if (setting.type === 'roles') {
            const list = [];
            for (const roleID of setting.value as string[]) {
                const role = message.guild.roles.get(roleID);
                if (!role) continue;

                list.push(
                    `*${
                        message.guild.id === roleID
                            ? role.name.slice(1)
                            : role.name
                    }*`
                );
            }
            return message.reply(
                message.translate('settings:CURRENT_VALUE', {
                    value: list.length ? list.join(', ') : NONE
                })
            );
        }

        if (setting.type === 'role') {
            const role = message.guild.roles.get(setting.value as string);
            return message.reply(
                message.translate('settings:CURRENT_VALUE', {
                    value: role ? role.name : NONE
                })
            );
        }

        if (setting.type === 'ms') {
            return message.reply(
                message.translate('settings:CURRENT_VALUE', {
                    value: setting.value
                        ? `${setting.value}ms`
                        : message.translate('common:DEFAULT')
                })
            );
        }

        if (setting.type === 'channel') {
            const channel = message.guild.channels.get(setting.value as string);
            return message.reply(
                message.translate('settings:CURRENT_VALUE', {
                    value: channel ? channel.toString() : NONE
                })
            );
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

            return message.reply(
                message.translate('settings:CURRENT_VALUE', { value: logText })
            );
        }

        return message.reply(
            message.translate('settings:CURRENT_VALUE', {
                value: setting.value || NONE
            })
        );
    }

    async edit(
        message: TypicalGuildMessage,
        setting: SettingsData,
        value: string,
        type: string
    ) {
        let payload = {};
        const ENABLE = message.translate('common:ENABLE').toLowerCase();
        const DISABLE = message.translate('common:DISABLE').toLowerCase();
        const ADD = message.translate('common:ADD').toLowerCase();
        const CLEAR = message.translate('common:CLEAR').toLowerCase();
        const REMOVE = message.translate('common:REMOVE').toLowerCase();
        const DEFAULT = message.translate('common:DEFAULT');
        const HERE = message.translate('common:HERE');
        const EMBED = message.translate('common:EMBED');

        if (setting.type === 'boolean') {
            if (
                ![DISABLE, ENABLE, 'enable', 'disable'].includes(
                    value.toLowerCase()
                )
            )
                return message.translate('settings:INVALID_OPTION');

            const enableSetting = ['enable', ENABLE].includes(
                value.toLowerCase()
            );

            payload = this.stringToObject(setting.path, enableSetting);
        }

        if (setting.type === 'roles') {
            if (
                [DISABLE, 'disable', CLEAR, 'clear'].includes(
                    value.toLowerCase()
                )
            ) {
                payload = this.stringToObject(setting.path, []);
            } else if (
                [ADD, 'add', REMOVE, 'remove'].includes(type.toLowerCase())
            ) {
                const args = roleRegex.exec(value);
                if (!args)
                    return message.error(
                        message.translate('misc:USAGE_ERROR', {
                            name: this.name,
                            prefix: this.client.config.prefix
                        })
                    );
                args.shift();

                const [roleID, roleName] = args;

                const role = roleID
                    ? message.guild.roles.get(roleID)
                    : message.guild.roles.find(
                          r => r.name.toLowerCase() === roleName.toLowerCase()
                      );

                if (!role)
                    return message.error(message.translate('give:INVALID'));

                const isAdd = [ADD, 'add'].includes(type.toLowerCase());

                if (isAdd && (setting.value as string[]).includes(role.id))
                    return message.error(
                        message.translate('settings:ROLE_EXISTS')
                    );
                if (!isAdd && !(setting.value as string[]).includes(role.id))
                    return message.error(
                        message.translate('settings:ROLE_NOT_SET')
                    );

                const newValue = isAdd
                    ? [...(setting.value as string[]), role.id]
                    : (setting.value as string[]).filter(id => id !== role.id);

                payload = this.stringToObject(setting.path, newValue);
            }
        }

        if (setting.type === 'role') {
            if ([DISABLE, 'disable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = roleRegex.exec(value);
                if (!args)
                    return message.error(
                        message.translate('misc:USAGE_ERROR', {
                            name: this.name,
                            prefix: this.client.config.prefix
                        })
                    );
                args.shift();

                const [roleID, roleName] = args;

                const role = roleID
                    ? message.guild.roles.get(roleID)
                    : message.guild.roles.find(
                          r => r.name.toLowerCase() === roleName.toLowerCase()
                      );

                if (!role)
                    return message.error(message.translate('give:INVALID'));

                payload = this.stringToObject(setting.path, role.id);
            }
        }

        if (setting.type === 'ms') {
            if (
                [DISABLE, 'disable', DEFAULT, 'default'].includes(
                    value.toLowerCase()
                )
            ) {
                payload = this.stringToObject(setting.path, null);
            } else {
                const args = msRegex.exec(value);
                if (!args)
                    return message.error(
                        message.translate('settings:INVALID_MS')
                    );
                args.shift();

                const [ms] = args;
                const amount = parseInt(ms, 10);

                if (amount > 600000 || amount < 2000)
                    return message.error(
                        message.translate('settings:INVALID_MS')
                    );

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
                    return message.error(
                        message.translate('misc:USAGE_ERROR', {
                            name: this.name,
                            prefix: this.client.config.prefix
                        })
                    );
                args.shift();

                const [channelID, channelName] = args;

                const channel = channelID
                    ? message.guild.channels.get(channelID)
                    : message.guild.channels.find(
                          r =>
                              r.name.toLowerCase() === channelName.toLowerCase()
                      );

                if (!channel)
                    return message.error(
                        message.translate('settings:INVALID_CHANNEL')
                    );
                if (channel.type !== 'text')
                    return message.error(
                        message.translate('settings:NOT_TEXT_CHANNEL')
                    );

                payload = this.stringToObject(setting.path, channel.id);
            }
        }

        if (setting.type === 'log') {
            if (!message.guild.settings.logs.id)
                return message.error(message.translate('settings:NEED_LOG'));

            if ([DISABLE, 'disable'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--disabled');
            } else if (
                [DEFAULT, 'default', ENABLE, 'enable'].includes(
                    value.toLowerCase()
                )
            ) {
                payload = this.stringToObject(setting.path, null);
            } else if ([EMBED, 'embed'].includes(value.toLowerCase())) {
                payload = this.stringToObject(setting.path, '--embed');
            } else {
                payload = this.stringToObject(setting.path, value);
            }
        }

        if (setting.type === 'default') {
            payload = this.stringToObject(
                setting.path,
                [DISABLE, 'disable'].includes(value.toLowerCase())
                    ? null
                    : value
            );
        }

        await this.client.settings.update(message.guild.id, payload);

        return message.success(message.translate('settings:UPDATED'));
    }

    stringToObject(path: string, value: unknown) {
        const stack = path.split('.');
        const last = stack.pop();
        const ret = {};
        let ref = ret;

        while (stack.length) {
            const i = stack.shift();
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ret[i] = {};
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ref = ref[i];
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ref[last] = value;

        return ret;
    }
}
