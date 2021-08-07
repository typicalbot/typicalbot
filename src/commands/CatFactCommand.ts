import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const CatFactCommand: Command = async (client, interaction) => {
    const data = await fetch('https://some-random-api.ml/facts/cat')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data.fact)
        .setFooter('Powered by some-random-api.ml');

    await interaction.reply({ embeds: [embed] });
};

CatFactCommand.options = {
    name: 'catfact',
    description: 'Retrieve a cat fact.'
};

export default CatFactCommand;
