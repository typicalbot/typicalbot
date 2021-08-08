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

client.login(process.env.DISCORD_TOKEN);
