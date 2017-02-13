const Categories = [ "Fun", "Moderation", "Staff", "TypicalBot", "Utility", "Music" ];
const path = `${__dirname.replace(/\/\w+$/, ``)}/Commands`;

class CommandsManager {
    constructor() {
        this.commands = {};

        for (let category of Categories) {
            let list = require(`${path}/${category}`);
            Object.keys(list).map(c => this.commands[c] = list[c]);
        }
    }

    reload() {
        const newlist = {};
        for (let category of Categories) {
            delete require.cache[`${path}/${category}.js`];
            let list = require(`${path}/${category}`);
            Object.keys(list).forEach(c => newlist[c] = list[c]);
        }
        this.commands = newlist;
    }

    get(text) {
        if (this.commands[text]) return this.commands[text];
        for (let command in this.commands) {
            let c = this.commands[command];
            if (c.aliases && c.aliases.includes(text)) return c;
        }
    }
}

module.exports = CommandsManager;
