import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const ThouartCommand: Command = async (client, interaction) => {
    const data = await fetch('https://quandyfactory.com/insult/json', { headers: { accept: 'application/json' } })
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data.insult)
        .setFooter('Powered by quandyfactory.com');

    await interaction.reply({ embeds: [embed] });
};

ThouartCommand.options = {
    name: 'thouart',
    description: 'Retrieve a thouart insult.'
};

export default ThouartCommand;
