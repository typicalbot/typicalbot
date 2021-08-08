import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const AdviceCommand: Command = async (client, interaction) => {
    const data = await fetch('https://api.adviceslip.com/advice')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.slip.advice)
        .setFooter('Powered by adviceslip.com');

    await interaction.reply({ embeds: [embed] });
};

AdviceCommand.options = {
    name: 'advice',
    description: 'Retrieve a little advice.'
};

export default AdviceCommand;
