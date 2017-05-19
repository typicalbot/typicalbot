const klaw = require("klaw");
const path = require("path");
const commandsPath = path.join(__dirname, "..", "Commands");

class CommandsManager {
    constructor(client) {
        this.client = client;

        this.data = new Map();

        this.init();
    }

    load(filePath) {
        let command = new (require(filePath))(this.client);
        this.data.set(command.name, command);
    }

    reload(filePath) {
        delete require.cache(filePath);
        let command = new (require(filePath))(this.client);
        this.data.set(command.name, command);
    }

    init() {
        klaw(commandsPath).on("data", item => {
            let file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;
            this.load(`${file.dir}/${file.base}`);
        });
    }

    get(text) {
        return new Promise((resolve, reject) => {
            if (this.data.has(text)) return resolve(this.data.get(text));

            this.data.forEach(c => {
                if (c.aliases && c.aliases.includes(text)) return resolve(c);
            });

            return resolve();
        });
    }
}

module.exports = CommandsManager;
