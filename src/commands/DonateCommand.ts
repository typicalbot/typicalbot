import Command from '../lib/command/Command';

const DonateCommand: Command = async (client, interaction) => {
    await interaction.reply({
        content: 'Thank you for the consideration of donating to the TypicalBot Team. You can support us on Patreon by [clicking here](https://www.patreon.com/TypicalBot).',
        ephemeral: true
    });
};

DonateCommand.options = {
    name: 'donate',
    description: 'Donate to the TypicalBot Team'
};

export default DonateCommand;
