import Command from '../lib/command/Command';

const DiceCommand: Command = async (client, interaction) => {
    const numbers: number[] = [];

    // roll twice
    numbers.push(Math.floor(Math.random() * 6));
    numbers.push(Math.floor(Math.random() * 6));

    await interaction.reply(`You rolled ${numbers.join(', ')}, totalling ${numbers.reduce((a, b) => a + b)}`);
};

DiceCommand.options = {
    name: 'dice',
    description: 'Roll a pair dice.'
};

export default DiceCommand;
