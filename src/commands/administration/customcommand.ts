import Command from '../../lib/structures/Command';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { CustomCommand } from '../../lib/database/structures/CustomCommand';

export default class extends Command {
    aliases = ['cc'];
    mode = MODE.STRICT;
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;

    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!parameters) {
            return message.error(message.translate('administration/customcommand:INVALID'));
        }

        const [command, content] = parameters.split(/(?<=^\S+)\s/);

        if (!command && !content) {
            return message.error(message.translate('administration/customcommand:INVALID'));
        }

        if (command === 'delete') {
            const toDelete = content.split(' ')[0];

            const row = (await this.client.handlers.database.get('custom_commands', { guildId: message.guild.id, command: toDelete })) as CustomCommand;

            if (!row) {
                // no command found
                return message.error(message.translate('administration/customcommand:NOT_FOUND', { command: toDelete }));
            }

            await this.client.handlers.database.delete('custom_commands', { guildId: message.guild.id, command: toDelete });

            return message.send(message.translate('administration/customcommand:DELETED', { command: toDelete }));
        }

        const row = (await this.client.handlers.database.get('custom_commands', { guildId: message.guild.id, command: command })) as CustomCommand;

        if (!row) {
            // new command
            const customCommand: CustomCommand = {
                guildId: message.guild.id,
                command: command,
                content: content
            };

            await this.client.handlers.database.insert('custom_commands', customCommand);

            return message.send(message.translate('administration/customcommand:CREATED', { command: command }));
        }

        // update command
        row.content = content;
        await this.client.handlers.database.update('custom_commands', { guildId: message.guild.id, command: command }, row);

        return message.send(message.translate('administration/customcommand:UPDATED', { command: command }));
    }
}
