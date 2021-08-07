import TypicalBotClient from './lib/TypicalBotClient';
import { Intents } from 'discord.js';
import dotenv from 'dotenv';
import Database from './lib/database';
import { commandMap } from './commands';

dotenv.config();

// TODO: Move this to TB Client
const client = new TypicalBotClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.containers.create('database', new Database());

// TODO: Move this to TB Client
const commands = commandMap();

// TODO: Move this TB Client
client.once('ready', async () => {
    console.log('Client Ready');

    const data = commands.map(c => c.options);
    await client.guilds.cache.get('736369721817038939')?.commands.set(data);
});

// TODO: Move this TB Client
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const name = interaction.commandName;

    if (commands.has(name)) {
        try {
            await commands.get(name)?.(client, interaction);
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
