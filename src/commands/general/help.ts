import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes, Links, PermissionsLevels } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['info', 'support'];
    dm = true;
    mode = Modes.STRICT;

    async execute(message: TypicalMessage, parameters: string) {
        if (!message.guild || !parameters) {
            const response = message.translate('general/help:NONE', {
                prefix: process.env.PREFIX,
                docs: Links.DOCUMENTATION,
                server: Links.SERVER
            });

            if (!message.embeddable) {
                const appendixA = 'Terms of Service: <https://typicalbot.com/legal/terms>';
                const appendixB = 'Privacy Policy: <https://typicalbot.com/legal/privacy>';

                return message.send(`${response}\n\n${appendixA}\n${appendixB}`);
            }

            return message.send(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('general/help:TYPICAL_INFO'))
                .setDescription(response)
                .addField('Version', this.client.version, false)
                .addField('Terms of Service', 'https://typicalbot.com/legal/terms', true)
                .addField('Privacy Policy', 'https://typicalbot.com/legal/privacy', true)
                .setFooter('TypicalBot', Links.ICON)
                .setTimestamp());
        }

        const command = this.client.commands.fetch(parameters, message.guild.settings);
        if (!command || command.permission === PermissionsLevels.BOT_OWNER) {
            const response = message.translate('general/help:INVALID', {
                name: parameters
            });
            if (!message.embeddable) return message.error(response, undefined, { allowedMentions: { users: [message.author.id] } });

            return message.send(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('general/help:INVALID_INFO'))
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
            return message.send([
                message.translate('general/help:TEXT_1', { name: parameters }),
                message.translate('general/help:TEXT_2'),
                message.translate('general/help:TEXT_3'),
                '\n',
                '```',
                message.translate('general/help:TEXT_4', { commandName: command.name }),
                message.translate('general/help:TEXT_5', { aliases: ALIASES }),
                message.translate('general/help:TEXT_6', { permission: this.client.handlers.permissions.levels.get(command.permission)?.title }),
                message.translate('general/help:TEXT_7', { description: DESCRIPTION }),
                message.translate('general/help:TEXT_8', { usage: USAGE }),
                '```'
            ].join('\n'));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/help:COMMAND_USAGE', {
                name: command.name
            }))
            .setDescription(message.translate('general/help:PARAMETERS'))
            .addFields([
                {
                    name: message.translate('general/help:COMMAND'),
                    value: command.name,
                    inline: true
                },
                {
                    name: message.translate('general/help:ALIASES'),
                    value: ALIASES
                },
                {
                    name: message.translate('general/help:PERMISSION'),
                    // @ts-ignore
                    value: this.client.handlers.permissions.levels.get(command.permission).title
                },
                {
                    name: message.translate('general/help:DESC'),
                    value: DESCRIPTION
                },
                {
                    name: message.translate('general/help:USE'),
                    value: USAGE
                }
            ])
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
