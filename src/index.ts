import TypicalBotClient from './lib/TypicalBotClient';
import dotenv from 'dotenv';
import Database from './lib/database';

dotenv.config();

const client = new TypicalBotClient();

const startService = async () => {
    try {
        client.containers.create('database', new Database());

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        client.destroy();
        process.exit(1);
    }
};

startService().catch(err => console.error(err));
