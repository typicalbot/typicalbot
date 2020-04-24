import { MessageEmbed } from 'discord.js';
import { Modes, Links } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['info', 'support'];
    dm = true;
    mode = Modes.STRICT;

    async execute(message: TypicalMessage, parameters: string) {
        if (!message.guild || !parameters) {
            const response = message.translate('core/help:NONE', {
                prefix: this.client.config.prefix,
                docs: Links.DOCUMENTATION,
                server: Links.SERVER
            });

            if (!message.embeddable) return message.send(`${response}\n\nTerms of Service: <https://sylke.co/terms>\nPrivacy Policy: <https://sylke.co/privacy>`);

            return message.send(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('core/help:TYPICAL_INFO'))
                .setDescription(response)
                .addField('Terms of Service', 'https://sylke.co/terms', true)
                .addField('Privacy Policy', 'https://sylke.co/privacy', true)
                .setFooter('TypicalBot', Links.ICON)
                .setTimestamp());
        }

        const command = this.client.commands.fetch(parameters, message.guild.settings);
        if (!command) {
            const response = message.translate('core/help:INVALID', {
                name: parameters
            });
            if (!message.embeddable) return message.error(response);

            return message.send(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('core/help:INVALID_INFO'))
                .setDescription(response)
                .setFooter('TypicalBot', Links.ICON)
                .setTimestamp());
        }

        const path = command.path.substring(command.path.indexOf('commands/') + 9, command.path.length - 3);

        const DESCRIPTION = message.translate(`${path}:DESCRIPTION`);
        const USAGE = message.translate(`${path}:USAGE`);
        const ALIASES = command.aliases.length
            ? command.aliases.join(', ')
            : message.translate('common:NONE');

        if (!message.embeddable)
            return message.send(message.translate('core/help:TEXT', {
                name: parameters,
                commandName: command.name,
                aliases: ALIASES,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                permission: this.client.handlers.permissions.levels.get(command.permission).title,
                description: DESCRIPTION,
                usage: USAGE
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/help:COMMAND_USAGE', {
                name: command.name
            }))
            .setDescription(message.translate('core/help:PARAMETERS'))
            .addFields([
                {
                    name: message.translate('core/help:COMMAND'),
                    value: command.name,
                    inline: true
                },
                {
                    name: message.translate('core/help:ALIASES'),
                    value: ALIASES
                },
                {
                    name: message.translate('core/help:PERMISSION'),
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    value: this.client.handlers.permissions.levels.get(command.permission).title
                },
                {
                    name: message.translate('core/help:DESC'),
                    value: DESCRIPTION
                },
                {
                    name: message.translate('core/help:USE'),
                    value: USAGE
                }
            ])
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
