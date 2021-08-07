import Command from '../lib/command/Command';

const InviteCommand: Command = async (client, interaction) => {
    await interaction.reply({
        content: 'You can invite TypicalBot by [clicking here](https://typicalbot.com/invite).',
        ephemeral: true
    });
};

InviteCommand.options = {
    name: 'invite',
    description: 'Invite TypicalBot to your server.'
};

export default InviteCommand;
