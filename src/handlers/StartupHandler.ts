import Handler from '../lib/handler/Handler';

const StartupHandler: Handler<'ready'> = async (client) => {
    console.log('Client ready.');

    const data = client.commands.map(c => c.options);
    await client.guilds.cache.get('736369721817038939')?.commands.set(data);
};

export default StartupHandler;
