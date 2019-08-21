import { Client } from 'discord.js';

/**
 * @extends external:Client
 */
export default class TypicalBot extends Client {
    /**
     * @typedef {external:DiscordClientOptions} TypicalBotOptions
     */

    /**
     * Constructor.
     * @param {TypicalBotOptions} [options={}] The options to pass through to the client.
     */
    constructor(options = {}) {
        super(options);
    }
}
