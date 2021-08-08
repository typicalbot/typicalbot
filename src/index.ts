import TypicalBotClient from './lib/TypicalBotClient';
import { Intents } from 'discord.js';
import dotenv from 'dotenv';
import Database from './lib/database';

dotenv.config();

// TODO: Move this to TB Client
const client = new TypicalBotClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.containers.create('database', new Database());

// TODO: Move this TB Client
client.once('ready', async () => {
    console.log('Client Ready');

    const data = client.commands.map(c => c.options);
    await client.guilds.cache.get('736369721817038939')?.commands.set(data);
});

client.login(process.env.DISCORD_TOKEN);
