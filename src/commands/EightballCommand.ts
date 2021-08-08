import Command from '../lib/command/Command';

const EightballCommand: Command =  async (client, interaction) => {
    const responses = [
        'It is certain.',
        'It is decidedly so.',
        'Without a doubt.',
        'Yes, definitely.',
        'You may rely on it.',
        'As I see it, yes.',
        'Most likely.',
        'Outlook is good.',
        'Yes.',
        'Signs point to yes.',
        'Reply hazy, try again.',
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.',
        'Don\'t count on it.',
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Very doubtful.'
    ];

    await interaction.reply(`${responses[Math.floor(Math.random() * 20)]}`);
};

EightballCommand.options = {
    name: '8ball',
    description: 'Magic 8ball'
};

export default EightballCommand;
