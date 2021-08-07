import Command from '../lib/command/Command';
import { MessageEmbed } from 'discord.js';

const UserCommand: Command = async (client, interaction) => {
    let target = interaction.options.getUser('target');

    if (!target) {
        target = interaction.user;
    }

    const targetMember = interaction.guild!.members.cache.get(target.id);
    const targetRoles = targetMember!.roles.cache.size > 1
        ? targetMember!.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.name)
            .slice(0, -1)
            .join(', ')
        : 'None';

    const embed = new MessageEmbed()
        .setAuthor(target.tag, target.displayAvatarURL({
            format: 'webp',
            size: 2048
        }))
        .setThumbnail(target.displayAvatarURL({
            format: 'webp',
            size: 2048
        }))
        .addFields([
            {
                name: 'ID',
                value: target.id,
                inline: true
            },
            {
                name: 'Status',
                value: `${targetMember!.presence?.status ?? 'Offline'}`,
                inline: true
            },
            {
                name: 'Joined',
                value: `<t:${Math.floor(targetMember!.joinedAt!.getTime() / 1000)}:f>`,
                inline: true
            },
            {
                name: `Roles (${targetMember!.roles.cache.size - 1})`,
                value: targetRoles,
                inline: false
            }
        ]);

    await interaction.reply({ embeds: [embed] });
};

UserCommand.options = {
    name: 'user',
    description: 'Get information about a user.',
    options: [
        {
            name: 'target',
            description: 'Select a user',
            type: 'USER',
            required: false
        }
    ]
};

export default UserCommand;
