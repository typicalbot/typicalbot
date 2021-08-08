import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const YearfactCommand: Command = async (client, interaction) => {
    const data = await fetch('http://numbersapi.com/random/year')
        .then(res => res.text())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data as string)
        .setFooter('Powered by numbersapi.com');

    await interaction.reply({ embeds: [embed] });
};

YearfactCommand.options = {
    name: 'yearfact',
    description: 'Retrieve a random year fact.'
};

export default YearfactCommand;
