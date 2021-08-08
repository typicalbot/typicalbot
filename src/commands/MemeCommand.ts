import Command from '../lib/command/Command';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const MemeCommand: Command = async (client, interaction) => {
    const { data: { children } } = await fetch('https://www.reddit.com/r/memes/top.json?sort=top&t=day&limit=500')
        .then(res => res.json())
        .catch(console.error);

    const filtered = children.filter((c: any) => c.data.over_18 === false);

    if (filtered.length === 0) {
        await interaction.reply('An error occurred while trying to fetch a meme.');
        return;
    }

    const meme = filtered[Math.floor(Math.random() * filtered.length)].data;

    const embed = new MessageEmbed()
        .setTitle(meme.title)
        .setImage(meme.url)
        .setFooter(`👍 ${meme.ups} | 👎 ${meme.downs}`));

    await interaction.reply({ embeds: [embed] });
};

MemeCommand.options = {
    name: 'meme',
    description: 'Retrieve a random meme.'
};

export default MemeCommand;
