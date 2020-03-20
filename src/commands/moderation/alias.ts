import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

const regex = /(list|add|remove|clear)(?:\s+([A-Za-z]+)(?:\s+([A-Za-z]+))?)?/i;

export default class extends Command {
    aliases = ['aliases'];
    permission = Constants.PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Constants.Modes.STRICT;
    access = Constants.AccessLevels.DONOR;

    async execute(message: TypicalGuildMessage, parameters?: string) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        });

        if (!parameters) return message.error(usageError);

        const args = regex.exec(parameters);
        if (!args) return message.error(usageError);
        args.shift();

        const [action, command, alias] = args;

        switch (action) {
            case 'list':
                return this.list(message);
            case 'add':
                return this.add(message, command, alias, usageError);
            case 'remove':
                return this.remove(message, command, usageError);
            case 'clear':
                return this.clear(message);
        }
    }

    async list(message: TypicalGuildMessage) {
        const NONE = message.translate('common:NONE');

        await message.reply([
            message.translate('moderation/alias:CURRENT'),
            message.guild.settings.aliases.length
                ? message.guild.settings.aliases
                    .map((a) => `${a.alias} -> ${a.command}`)
                    .join('\n')
                : NONE
        ]);
    }

    async add(message: TypicalGuildMessage,
        command: string,
        alias: string,
        usageError: string) {
        if (!command || !alias) return message.error(usageError);

        const cmd = this.client.commands.fetch(command, message.guild.settings);
        if (!cmd)
            return message.error(message.translate('moderation/alias:INVALID_COMMAND'));

        const aliasList = message.guild.settings.aliases;
        const aliasExists = aliasList.find((a) => a.alias === alias);
        if (aliasExists) {
            const aliasCommand = this.client.commands.fetch(aliasExists.command, message.guild.settings);
            return message.error(message.translate('moderation/alias:ALIAS_EXISTS', {
                name: aliasCommand ? aliasCommand.name : null
            }));
        }

        if (alias.length > 10)
            return message.error(message.translate('moderation/alias:LONG'));

        aliasList.push({ alias, command: cmd.name });

        const updated = await this.client.settings
            .update(message.guild.id, { aliases: aliasList })
            .catch(() => null);

        if (!updated)
            return message.error(message.translate('moderation/alias:ADD_ERROR'));

        return message.success(message.translate('moderation/alias:ADDED'));
    }

    async remove(message: TypicalGuildMessage,
        command: string,
        usageError: string) {
        if (!command) return message.error(usageError);

        const aliasList = message.guild.settings.aliases;
        const aliasIndex = aliasList.findIndex((a) => a.alias === command);

        if (aliasIndex < 0)
            return message.error(message.translate('moderation/alias:INVALID_ALIAS'));

        aliasList.splice(aliasIndex, 1);

        const updated = await this.client.settings
            .update(message.guild.id, { aliases: aliasList })
            .catch(() => null);
        if (!updated)
            return message.error(message.translate('moderation/alias:REMOVE_ERROR'));

        return message.success(message.translate('moderation/alias:REMOVED'));
    }

    clear(message: TypicalGuildMessage) {
        this.client.settings
            .update(message.guild.id, { aliases: [] })
            .then(() =>
                message.success(message.translate('moderation/alias:CLEARED')))
            .catch(() =>
                message.error(message.translate('moderation/alias:CLEAR_ERROR')));
    }
}
