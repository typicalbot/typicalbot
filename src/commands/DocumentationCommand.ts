import Command from '../lib/command/Command';

const DocumentationCommand: Command = async (client, interaction) => {
    await interaction.reply({
        content: 'You can view TypicalBot documentation by [clicking here](https://typicalbot.com/docs).',
        ephemeral: true
    });
};

DocumentationCommand.options = {
    name: 'docs',
    description: 'View TypicalBot\'s documentation.'
};

export default DocumentationCommand;
