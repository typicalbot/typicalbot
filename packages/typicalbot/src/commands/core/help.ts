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
            const response = message.translate('help:NONE', {
                prefix: this.client.config.prefix,
                docs: Constants.Links.DOCUMENTATION,
                server: Constants.Links.SERVER
            });

            if (!message.embedable) return message.send(response);

            return message.send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle(message.translate('help:TYPICAL_INFO'))
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
            const response = message.translate('help:INVALID', {
                name: parameters
            });
            if (!message.embedable) return message.error(response);

            return message.send(
                new MessageEmbed()
                    .setColor(0x00adff)
                    .setTitle(message.translate('help:INVALID_INFO'))
                    .setDescription(response)
                    .setFooter('TypicalBot', Constants.Links.ICON)
                    .setTimestamp()
            );
        }

        if (!message.embedable)
            return message.send(
                message.translate('help:TEXT', {
                    name: parameters,
                    commandName: command.name,
                    aliases: command.aliases.length
                        ? command.aliases.join(', ')
                        : message.translate('common:NONE'),
                    permission: command.permission,
                    description: message.translate(
                        `${command.name}:DESCRIPTION`
                    ),
                    usage: message.translate(`${command.name}:USAGE`)
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(
                    message.translate('help:COMMAND_USAGE', {
                        name: command.name
                    })
                )
                .setDescription(message.translate('help:PARAMETERS'))
                .addField(message.translate('help:COMMAND'), command.name, true)
                .addField(
                    message.translate('help:ALIASES'),
                    command.aliases.length ? command.aliases.join(', ') : 'None'
                )
                .addField(message.translate('help:PERMISSION'), {
                    permission: command.permission
                })
                .addField(message.translate('help:DESC'), command.description)
                .addField(message.translate('help:USE'), command.usage)
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
