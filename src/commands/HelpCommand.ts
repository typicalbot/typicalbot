import Command from '../lib/command/Command';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

const HelpCommand: Command = async (client, interaction) => {
    const embed = new MessageEmbed()
        .setTitle('TypicalBot')
        .setDescription('Start your Discord community off right! TypicalBot seamlessly helps you and your moderators moderate your community and entertains your members.');

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Invite')
                .setURL('https://typicalbot.com/invite')
                .setStyle('LINK'),
            new MessageButton()
                .setLabel('Commands')
                .setURL('https://typicalbot.com/docs')
                .setStyle('LINK'),
            new MessageButton()
                .setLabel('Support')
                .setURL('https://typicalbot.com/support')
                .setStyle('LINK')
        );

    await interaction.reply({ embeds: [embed], components: [row] });
};

HelpCommand.options = {
    name: 'help',
    description: 'Shows information about TypicalBot'
};

export default HelpCommand;
