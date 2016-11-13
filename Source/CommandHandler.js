const Categories = [ "Utility" , "Creator" , "TypicalBot" , "Moderation" , "Fun" , "Music" ];

class CommandHandler {
    constructor() {
        this.commands = {};

        for (let category of Categories) {
            category = require(`./Commands/${category}`);
            Object.keys(category).map(c => {
                this.commands[c] = category[c];
            });
        }
    }

    reload() {
        let newList = {};
        for (let category of Categories) {
            delete require.cache[`${__dirname}/Commands/${category}.js`];
            category = require(`./Commands/${category}`);
            Object.keys(category).map(c => {
                newList[c] = category[c];
            });
        }
        this.commands = newList;
    }

    getCommand(text) {
        let commands = this.commands;
        if (this.commands[text]) return this.commands[text];
        for (let command in this.commands) if (this.commands[command].aliases && this.commands[command].aliases.includes(text)) return this.commands[command];
        return null;
    }
}

module.exports = CommandHandler;
