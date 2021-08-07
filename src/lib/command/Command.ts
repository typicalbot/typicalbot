import TypicalBotClient from '../TypicalBotClient';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';

interface Command {
    (
        client: TypicalBotClient,
        interaction: CommandInteraction
    ): Promise<unknown> | unknown;

    options: ApplicationCommandData;
}

export default Command;
