import Command from '../lib/command/Command';

const PingCommand: Command = async (client, interaction) => {
    await interaction.reply(`Pong! Latency: ${client.ws.ping}ms`);
};

PingCommand.options = {
    name: 'ping',
    description: 'Check to see if TypicalBot is alive.'
};

export default PingCommand;
