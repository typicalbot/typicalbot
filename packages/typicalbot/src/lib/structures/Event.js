export default class Event {
    /**
     * @typedef EventOptions
     * @property {string} [description='No description available']
     * @property {string} [usage='No usage available']
     */

    /**
     * Constructor.
     * @param {TypicalBot} client
     * @param {string} file
     * @param {EventOptions} [options={}]
     */
    constructor(client, file, options = {}) {
        Object.defineProperty(this, 'client', { value: client });
    }

    /**
     * @param {...args} args
     * @abstract
     */
    async run(...args) {
        throw new Error('This event has not been implemented yet.');
    }
}
