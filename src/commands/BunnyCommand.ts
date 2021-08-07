import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const BunnyCommand: Command = async (client, interaction) => {
    const data = await fetch('https://api.bunnies.io/v2/loop/random/?media=poster')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.media.poster)
        .setFooter('Powered by bunnies.io');

    await interaction.reply({ embeds: [embed] });
};

BunnyCommand.options = {
    name: 'bunny',
    description: 'Retrieve a bunny image.'
};

export default BunnyCommand;
