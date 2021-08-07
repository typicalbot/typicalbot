import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const DogCommand: Command = async (client, interaction) => {
    const data = await fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.message)
        .setFooter('Powered by dog.ceo');

    await interaction.reply({ embeds: [embed] });
};

DogCommand.options = {
    name: 'dog',
    description: 'Retrieve a dog image.'
};

export default DogCommand;
