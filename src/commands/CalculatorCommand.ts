import Command from '../lib/command/Command';
import { MessageEmbed } from 'discord.js';
import { evaluate } from 'mathjs';

const CalculatorCommand: Command = async (client, interaction) => {
    const input = interaction.options.getString('input')!;

    try {
        const result = evaluate(input);

        const embed = new MessageEmbed()
            .setTitle('Result')
            .setDescription(`**Input:**\n${input}\n\n**Result:**\n${result}`);

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        await interaction.reply('An error occurred while evaluating the math expression.');
    }
};

CalculatorCommand.options = {
    name: 'calc',
    description: 'Calculate an expression.',
    options: [
        {
            name: 'input',
            description: 'Enter a expression',
            type: 'STRING',
            required: true
        }
    ]
};

export default CalculatorCommand;
