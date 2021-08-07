import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const BirdCommand: Command = async (client, interaction) => {
    const data = await fetch('https://some-random-api.ml/img/birb')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.link)
        .setFooter('Powered by some-random-api.ml');

    await interaction.reply({ embeds: [embed] });
};

BirdCommand.options = {
    name: 'bird',
    description: 'Retrieve a bird image.'
};

export default BirdCommand;
