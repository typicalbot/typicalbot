import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const YomommaCommand: Command = async (client, interaction) => {
    const data = await fetch('https://api.yomomma.info')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data.joke)
        .setFooter('Powered by yomomma.info');

    await interaction.reply({ embeds: [embed] });
};

YomommaCommand.options = {
    name: 'yomomma',
    description: 'Retrieve a yomomma joke.'
};

export default YomommaCommand;
