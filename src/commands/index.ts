import { Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import Command from '../lib/command/Command';
import { Routes } from 'discord-api-types/v9';
import AvatarCommand from './AvatarCommand';
import PingCommand from './PingCommand';
import ServerCommand from './ServerCommand';
import UrbanDictionaryCommand from './UrbanDictionaryCommand';
import UserCommand from './UserCommand';

const commandMap = (): Collection<string, Command> => {
    const collection = new Collection<string, Command>();

    // Register commands
    collection.set(AvatarCommand.options.name, AvatarCommand);
    collection.set(PingCommand.options.name, PingCommand);
    collection.set(ServerCommand.options.name, ServerCommand);
    collection.set(UrbanDictionaryCommand.options.name, UrbanDictionaryCommand);
    collection.set(UserCommand.options.name, UserCommand);

    return collection;
};

const registerCommands = async (token: string, applicationId: string) => {
    const commands = commandMap().map(c => c.options);
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Registering global slash commands.');

        await rest.put(
            Routes.applicationCommands(applicationId),
            {
                body: commands
            }
        );

        console.log('Registered global slash commands.');
    } catch (error) {
        console.error(error);
    }
};

export {
    commandMap,
    registerCommands
};
