import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['info', 'support'];
    dm = true;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalMessage, parameters: string) {
        if (!message.guild || !parameters) {
            const response = message.translate('core/help:NONE', {
                prefix: this.client.config.prefix,
                docs: Constants.Links.DOCUMENTATION,
                server: Constants.Links.SERVER
            });

            if (!message.embeddable) return message.send(response);

            return message.send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle(message.translate('core/help:TYPICAL_INFO'))
                    .setDescription(response)
                    .setFooter('TypicalBot', Constants.Links.ICON)
                    .setTimestamp()
            );
        }

        const command = this.client.commands.fetch(
            parameters,
            message.guild.settings
        );
        if (!command) {
            const response = message.translate('core/help:INVALID', {
                name: parameters
            });
            if (!message.embeddable) return message.error(response);

            return message.send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle(message.translate('core/help:INVALID_INFO'))
                    .setDescription(response)
                    .setFooter('TypicalBot', Constants.Links.ICON)
                    .setTimestamp()
            );
        }

        const path = command.path.substring(
            command.path.indexOf('commands/') + 9,
            command.path.length - 3
        );

        const DESCRIPTION = message.translate(`${path}:DESCRIPTION`);
        const USAGE = message.translate(`${path}:USAGE`);
        const ALIASES = command.aliases.length
            ? command.aliases.join(', ')
            : message.translate('common:NONE');

        if (!message.embeddable)
            return message.send(
                message.translate('core/help:TEXT', {
                    name: parameters,
                    commandName: command.name,
                    aliases: ALIASES,
                    permission: command.permission,
                    description: DESCRIPTION,
                    usage: USAGE
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(
                    message.translate('core/help:COMMAND_USAGE', {
                        name: command.name
                    })
                )
                .setDescription(message.translate('core/help:PARAMETERS'))
                .addField(
                    message.translate('core/help:COMMAND'),
                    command.name,
                    true
                )
                .addField(message.translate('core/help:ALIASES'), ALIASES)
                .addField(message.translate('core/help:PERMISSION'), {
                    permission: command.permission
                })
                .addField(message.translate('core/help:DESC'), DESCRIPTION)
                .addField(message.translate('core/help:USE'), USAGE)
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
