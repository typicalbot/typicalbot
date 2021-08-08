import CommandCollection from './CommandCollection';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import {
    AdviceCommand,
    AvatarCommand,
    BirdCommand,
    BunnyCommand,
    CalculatorCommand,
    CatCommand,
    CatFactCommand,
    ChucknorrisCommand,
    CoinflipCommand,
    DiceCommand,
    DocumentationCommand,
    DogCommand,
    DonateCommand,
    DuckCommand,
    EightballCommand,
    FoxCommand,
    HelpCommand,
    InviteCommand,
    MemeCommand,
    PandaCommand,
    PingCommand,
    PunCommand,
    ServerCommand,
    ThouartCommand,
    UrbanDictionaryCommand,
    UserCommand,
    VoteCommand,
    YearfactCommand,
    YomommaCommand
} from '../../commands';

const commandMap = (): CommandCollection => {
    const collection = new CommandCollection();

    collection.add(AdviceCommand);
    collection.add(AvatarCommand);
    collection.add(BirdCommand);
    collection.add(BunnyCommand);
    collection.add(CalculatorCommand);
    collection.add(CatCommand);
    collection.add(CatFactCommand);
    collection.add(ChucknorrisCommand);
    collection.add(CoinflipCommand);
    collection.add(DiceCommand);
    collection.add(DocumentationCommand);
    collection.add(DogCommand);
    collection.add(DonateCommand);
    collection.add(DuckCommand);
    collection.add(EightballCommand);
    collection.add(FoxCommand);
    collection.add(HelpCommand);
    collection.add(InviteCommand);
    collection.add(MemeCommand);
    collection.add(PandaCommand);
    collection.add(PingCommand);
    collection.add(PunCommand);
    collection.add(ServerCommand);
    collection.add(ThouartCommand);
    collection.add(UrbanDictionaryCommand);
    collection.add(UserCommand);
    collection.add(VoteCommand);
    collection.add(YearfactCommand);
    collection.add(YomommaCommand);

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
