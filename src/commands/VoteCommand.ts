import Command from '../lib/command/Command';

const VoteCommand: Command = async (client, interaction) => {
    await interaction.reply({
        content: 'You can vote for TypicalBot on top.gg by [clicking here](https://top.gg/bot/typicalbot/vote).',
        ephemeral: true
    });
};

VoteCommand.options = {
    name: 'vote',
    description: 'Vote for TypicalBot on top.gg'
};

export default VoteCommand;
