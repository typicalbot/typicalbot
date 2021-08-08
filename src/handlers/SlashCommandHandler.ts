import Handler from '../lib/handler/Handler';

const SlashCommandHandler: Handler<'interactionCreate'> = async (client, interaction) => {
    if (!interaction.isCommand()) return;

    const name = interaction.commandName;

    if (client.commands.has(name)) {
        try {
            await client.commands.get(name)?.(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while trying to execute this command.',
                ephemeral: true
            });
        }
    }
};

export default SlashCommandHandler;
