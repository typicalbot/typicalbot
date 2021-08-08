import { Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import Command from '../lib/command/Command';
import { Routes } from 'discord-api-types/v9';
import AvatarCommand from './AvatarCommand';
import PingCommand from './PingCommand';
import ServerCommand from './ServerCommand';
import UrbanDictionaryCommand from './UrbanDictionaryCommand';
import UserCommand from './UserCommand';
import DonateCommand from './DonateCommand';
import VoteCommand from './VoteCommand';
import InviteCommand from './InviteCommand';
import BirdCommand from './BirdCommand';
import BunnyCommand from './BunnyCommand';
import CatCommand from './CatCommand';
import CatFactCommand from './CatFactCommand';
import DogCommand from './DogCommand';
import DuckCommand from './DuckCommand';
import FoxCommand from './FoxCommand';
import PandaCommand from './PandaCommand';
import HelpCommand from './HelpCommand';
import DocumentationCommand from './DocumentationCommand';
import AdviceCommand from './AdviceCommand';
import EightballCommand from './EightballCommand';
import ChucknorrisCommand from './ChucknorrisCommand';
import CoinflipCommand from './CoinflipCommand';
import YomommaCommand from './YomommaCommand';
import PunCommand from './PunCommand';
import ThouartCommand from './ThouartCommand';
import YearfactCommand from './YearfactCommand';
import MemeCommand from './MemeCommand';
import DiceCommand from './DiceCommand';

const commandMap = (): Collection<string, Command> => {
    const collection = new Collection<string, Command>();

    // Register commands
    collection.set(AdviceCommand.options.name, AdviceCommand);
    collection.set(AvatarCommand.options.name, AvatarCommand);
    collection.set(BirdCommand.options.name, BirdCommand);
    collection.set(BunnyCommand.options.name, BunnyCommand);
    collection.set(CatCommand.options.name, CatCommand);
    collection.set(CatFactCommand.options.name, CatFactCommand);
    collection.set(ChucknorrisCommand.options.name, ChucknorrisCommand);
    collection.set(CoinflipCommand.options.name, CoinflipCommand);
    collection.set(DiceCommand.options.name, DiceCommand);
    collection.set(DocumentationCommand.options.name, DocumentationCommand);
    collection.set(DogCommand.options.name, DogCommand);
    collection.set(DonateCommand.options.name, DonateCommand);
    collection.set(DuckCommand.options.name, DuckCommand);
    collection.set(EightballCommand.options.name, EightballCommand);
    collection.set(FoxCommand.options.name, FoxCommand);
    collection.set(HelpCommand.options.name, HelpCommand);
    collection.set(InviteCommand.options.name, InviteCommand);
    collection.set(MemeCommand.options.name, MemeCommand);
    collection.set(PandaCommand.options.name, PandaCommand);
    collection.set(PingCommand.options.name, PingCommand);
    collection.set(PunCommand.options.name, PunCommand);
    collection.set(ServerCommand.options.name, ServerCommand);
    collection.set(ThouartCommand.options.name, ThouartCommand);
    collection.set(UrbanDictionaryCommand.options.name, UrbanDictionaryCommand);
    collection.set(UserCommand.options.name, UserCommand);
    collection.set(VoteCommand.options.name, VoteCommand);
    collection.set(YearfactCommand.options.name, YearfactCommand);
    collection.set(YomommaCommand.options.name, YomommaCommand);

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
