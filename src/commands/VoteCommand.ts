import Command from '../lib/command/Command';

const VoteCommand: Command = async (client, interaction) => {
    await interaction.reply({
        content: 'You can vote for TypicalBot on top.gg by [clicking here](https://top.gg/bot/typicalbot).',
        ephemeral: true
    });
};

VoteCommand.options = {
    name: 'Vote',
    description: 'Vote for TypicalBot on top.gg'
};

export default VoteCommand;
