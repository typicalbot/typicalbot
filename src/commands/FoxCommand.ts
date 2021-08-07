import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const FoxCommand: Command = async (client, interaction) => {
    const data = await fetch('https://some-random-api.ml/img/fox')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.link)
        .setFooter('Powered by some-random-api.ml');

    await interaction.reply({ embeds: [embed] });
};

FoxCommand.options = {
    name: 'fox',
    description: 'Retrieve a fox image.'
};

export default FoxCommand;
