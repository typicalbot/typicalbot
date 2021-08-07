import TypicalBotClient from './lib/TypicalBotClient';
import { Collection, Intents } from 'discord.js';
import Command from './lib/command/Command';
import PingCommand from './commands/PingCommand';
import AvatarCommand from './commands/AvatarCommand';
import ServerCommand from './commands/ServerCommand';
import UserCommand from './commands/UserCommand';
import dotenv from 'dotenv';
import UrbanDictionaryCommand from './commands/UrbanDictionaryCommand';

dotenv.config();

// TODO: Move this to TB Client
const client = new TypicalBotClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// TODO: Move this to TB Client
const commandMap = new Collection<string, Command>();

commandMap.set('ping', PingCommand);
commandMap.set('avatar', AvatarCommand);
commandMap.set('server', ServerCommand);
commandMap.set('user', UserCommand);
commandMap.set('urban', UrbanDictionaryCommand);

// TODO: Move this TB Client
client.once('ready', async () => {
    console.log('Client Ready');

    const data = commandMap.map(c => c.options);
    await client.guilds.cache.get('736369721817038939')?.commands.set(data);
});

// TODO: Move this TB Client
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const name = interaction.commandName;

    if (commandMap.has(name)) {
        try {
            await commandMap.get(name)?.(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while trying to execute this command.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
