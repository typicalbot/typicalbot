import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const ChucknorrisCommand: Command = async (client, interaction) => {
    const data = await fetch('https://api.icndb.com/jokes/random')
        .then(res => res.json())
        .catch(console.error);

    const embed = new MessageEmbed()
        .setDescription(data.value.joke)
        .setFooter('Powered by icndb.com');

    await interaction.reply({ embeds: [embed] });
};

ChucknorrisCommand.options = {
    name: 'chucknorris',
    description: 'Retrieve a random chuck norris quote.'
};

export default ChucknorrisCommand;
