import Command from '../lib/command/Command';
import { MessageEmbed } from 'discord.js';

const ServerCommand: Command = async (client, interaction) => {
    const owner = await interaction.guild!.fetchOwner();

    const embed = new MessageEmbed()
        .setAuthor(interaction.guild!.name, interaction.guild!.iconURL({
            format: 'webp',
            size: 2048
        }) ?? '')
        .setThumbnail(interaction.guild!.iconURL({
            format: 'webp',
            size: 2048
        }) ?? '')
        .addFields([
            {
                name: 'ID',
                value: interaction.guild!.id,
                inline: true
            },
            {
                name: 'Owner',
                value: `${owner.user.tag}\n${interaction.guild!.ownerId}`,
                inline: true
            },
            {
                name: 'Created',
                value: `<t:${Math.floor(interaction.guild!.createdAt.getTime() / 1000)}:f>`,
                inline: true
            },
            {
                name: 'Verification',
                value: interaction.guild!.verificationLevel,
                inline: true
            },
            {
                name: 'Channels',
                value: `${interaction.guild!.channels.cache.size}`,
                inline: true
            },
            {
                name: 'Members',
                value: `${interaction.guild!.memberCount}`,
                inline: true
            },
            {
                name: 'Roles',
                value: `${interaction.guild!.roles.cache.size}`,
                inline: true
            },
            {
                name: 'Emojis',
                value: `${interaction.guild!.emojis.cache.size}`,
                inline: true
            },
            {
                name: 'Boosters',
                value: `${interaction.guild!.premiumSubscriptionCount ?? 0}`,
                inline: true
            }
        ]);

    await interaction.reply({ embeds: [embed] });
};

ServerCommand.options = {
    name: 'server',
    description: 'Get information about the server.'
};

export default ServerCommand;
