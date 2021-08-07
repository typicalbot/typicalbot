import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const DuckCommand: Command = async (client, interaction) => {
    const data = await fetch('https://random-d.uk/api/v2/quack')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.url)
        .setFooter('Powered by random-d.uk');

    await interaction.reply({ embeds: [embed] });
};

DuckCommand.options = {
    name: 'dog',
    description: 'Retrieve a dog image.'
};

export default DuckCommand;
