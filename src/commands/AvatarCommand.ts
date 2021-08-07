import Command from '../lib/command/Command';
import { MessageEmbed } from 'discord.js';

const AvatarCommand: Command = async (client, interaction) => {
    let target = interaction.options.getUser('target');

    if (!target) {
        target = interaction.user;
    }

    const embed = new MessageEmbed()
        .setTitle(target.tag)
        .setImage(target.displayAvatarURL({
            format: 'webp',
            size: 2048
        }));

    await interaction.reply({ embeds: [embed] });
};

AvatarCommand.options = {
    name: 'avatar',
    description: 'Get the avatar of yourself.',
    options: [
        {
            name: 'target',
            description: 'Select a user',
            type: 'USER',
            required: false
        }
    ]
};

export default AvatarCommand;
