import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const UrbanDictionaryCommand: Command = async (client, interaction) => {
    const input = interaction.options.getString('input')!;

    const data = await fetch(`https://api.urbandictionary.com/v0/define?term=${input}`)
        .then(res => res.json())
        .catch(console.error);

    if (!data) {
        await interaction.reply({ content: `An error occurred while trying to look up ${input}.`, ephemeral: true });
        return;
    }

    const [resp] = data.list;

    if (!resp) {
        await interaction.reply({ content: `Could not find a definition for ${input}.`, ephemeral: true });
        return;
    }

    const rating = Math.round((resp.thumbs_up / (resp.thumbs_up + resp.thumbs_down)) * 100);

    const embed = new MessageEmbed()
        .setTitle(input)
        .setURL(resp.permalink)
        .setDescription(resp.definition)
        .setFooter(`👍 ${resp.thumbs_up} / 👎 ${resp.thumbs_down} (${rating}%)`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
};

UrbanDictionaryCommand.options = {
    name: 'urban',
    description: 'Look up a word on urban dictionary.',
    options: [
        {
            name: 'input',
            description: 'Enter a word',
            type: 'STRING',
            required: true
        }
    ]
};

export default UrbanDictionaryCommand;
