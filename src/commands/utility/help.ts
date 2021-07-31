import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { MODE, LINK, PERMISSION_LEVEL } from '../../lib/utils/constants';
import { version } from '../../../package.json';

export default class extends Command {
    dm = true;
    mode = MODE.STRICT;

    async execute(message: TypicalMessage, parameters: string) {
        if (!message.guild || !parameters) {
            const response = message.translate('utility/help:NONE', {
                prefix: process.env.PREFIX,
                docs: LINK.DOCUMENTATION,
                server: LINK.SERVER
            });

            if (!message.embeddable) {
                const appendixA = `Terms of Service: <${LINK.TERMS_OF_SERVICE}>`;
                const appendixB = `Privacy Policy: <${LINK.PRIVACY_POLICY}>`;

                return message.send(`${response}\n\n${appendixA}\n${appendixB}`);
            }

            return message.embed(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('utility/help:TYPICAL_INFO'))
                .setDescription(response)
                .addField('Version', version, false)
                .addField('Terms of Service', LINK.TERMS_OF_SERVICE, true)
                .addField('Privacy Policy', LINK.PRIVACY_POLICY, true)
                .setFooter('TypicalBot', LINK.ICON)
                .setTimestamp());
        }

        const command = this.client.commands.fetch(parameters, message.guild.settings);
        if (!command || command.permission === PERMISSION_LEVEL.BOT_OWNER) {
            const response = message.translate('utility/help:INVALID', {
                name: parameters
            });
            if (!message.embeddable) return message.error(response);

            return message.embed(new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('utility/help:INVALID_INFO'))
                .setDescription(response)
                .setFooter('TypicalBot', LINK.ICON)
                .setTimestamp());
        }

        let path = command.path.substring(command.path.indexOf('commands/') + 9, command.path.length - 3);

        if (process.platform === 'win32') {
            path = command.path.substring(command.path.indexOf('commands\\') + 9, command.path.length - 3).replace('\\', '/');
        }

        const DESCRIPTION = message.translate(`${path}:DESCRIPTION`);
        const USAGE = message.translate(`${path}:USAGE`);
        const ALIASES = command.aliases.length
            ? command.aliases.join(', ')
            : message.translate('common:NONE');

        if (!message.embeddable)
            return message.send([
                message.translate('utility/help:TEXT_1', { name: parameters }),
                message.translate('utility/help:TEXT_2'),
                message.translate('utility/help:TEXT_3'),
                '\n',
                '```',
                message.translate('utility/help:TEXT_4', { commandName: command.name }),
                message.translate('utility/help:TEXT_5', { aliases: ALIASES }),
                message.translate('utility/help:TEXT_6', { permission: this.client.handlers.permissions.levels.get(command.permission)?.title }),
                message.translate('utility/help:TEXT_7', { description: DESCRIPTION }),
                message.translate('utility/help:TEXT_8', { usage: USAGE }),
                '```'
            ].join('\n'));

        return message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('utility/help:COMMAND_USAGE', {
                name: command.name
            }))
            .setDescription(message.translate('utility/help:PARAMETERS'))
            .addFields([
                {
                    name: message.translate('utility/help:COMMAND'),
                    value: command.name,
                    inline: true
                },
                {
                    name: message.translate('utility/help:ALIASES'),
                    value: ALIASES
                },
                {
                    name: message.translate('utility/help:PERMISSION'),
                    // @ts-ignore
                    value: this.client.handlers.permissions.levels.get(command.permission).title
                },
                {
                    name: message.translate('utility/help:DESC'),
                    value: DESCRIPTION
                },
                {
                    name: message.translate('utility/help:USE'),
                    value: USAGE
                }
            ])
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp());
    }
}
