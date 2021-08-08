import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const PunCommand: Command = async (client, interaction) => {
    const data = await fetch('https://icanhazdadjoke.com', { headers: { accept: 'application/json' } })
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data.joke)
        .setFooter('Powered by icanhazdadjoke.com');

    await interaction.reply({ embeds: [embed] });
};

PunCommand.options = {
    name: 'pun',
    description: 'Retrieve a pun.'
};

export default PunCommand;
