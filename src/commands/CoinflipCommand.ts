import Command from '../lib/command/Command';

const CoinflipCommand: Command =  async (client, interaction) => {
    const responses = [
        'Heads',
        'Tails'
    ];

    await interaction.reply(`${responses[Math.floor(Math.random() * 2)]}`);
};

CoinflipCommand.options = {
    name: 'coinflip',
    description: 'Flip a coin.'
};

export default CoinflipCommand;
