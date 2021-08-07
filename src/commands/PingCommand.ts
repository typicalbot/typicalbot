import Command from '../lib/command/Command';
import { promisify } from 'util';

const wait = promisify(setTimeout);

const PingCommand: Command = async (client, interaction) => {
    await interaction.reply('Pong!');
    await wait(2000);
    await interaction.editReply(`Pong! Latency: ${client.ws.ping}ms`);
};

PingCommand.options = {
    name: 'ping',
    description: 'Check to see if TypicalBot is alive.'
};

export default PingCommand;
