const klaw = require("klaw");
const path = require("path");
const commandsPath = path.join(__dirname, "..", "commands");

module.exports = class {
    constructor(client) {
        this.client = client;

        this.data = new Map();

        this.init();
    }

    load(filePath) {
        const command = new (require(filePath))(this.client, filePath);
        this.data.set(command.name, command);
    }

    reload(filePath) {
        delete require.cache[filePath];
        const command = new (require(filePath))(this.client);
        this.data.set(command.name, command);
    }

    init() {
        klaw(commandsPath).on("data", item => {
            const file = path.parse(item.path);
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
};
