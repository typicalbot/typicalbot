import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const PandaCommand: Command = async (client, interaction) => {
    const data = await fetch('https://some-random-api.ml/img/panda')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setImage(data.link)
        .setFooter('Powered by some-random-api.ml');

    await interaction.reply({ embeds: [embed] });
};

PandaCommand.options = {
    name: 'panda',
    description: 'Retrieve a panda image.'
};

export default PandaCommand;
