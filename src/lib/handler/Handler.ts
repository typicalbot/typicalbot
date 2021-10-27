import TypicalClient from '../TypicalClient';
import { ClientEvents } from 'discord.js';

type Handler<E extends keyof ClientEvents> = (
    client: TypicalClient,
    ...args: ClientEvents[E]
) => Promise<unknown> | unknown;

export default Handler;
