import TypicalBotClient from '../TypicalBotClient';
import { ClientEvents } from 'discord.js';

type Handler<E extends keyof ClientEvents> = (
    client: TypicalBotClient,
    ...args: ClientEvents[E]
) => Promise<unknown> | unknown;

export default Handler;
