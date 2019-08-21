export default class Command {
    /**
     * @typedef CommandOptions
     * @property {string} [description='No description available']
     * @property {string} [usage='No usage available']
     */

    /**
     * Constructor.
     * @param {TypicalBot} client
     * @param {string} file
     * @param {CommandOptions} [options={}]
     */
    constructor(client, file, options = {}) {
        Object.defineProperty(this, 'client', { value: client });
    }

    /**
     * @param {external:Message} message
     * @abstract
     */
    async run() {
        throw new Error('This command has not been implemented yet.');
    }
}
