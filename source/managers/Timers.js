const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.taskTypes = new Collection();

        this.tasks = new Collection();

        this.init();
    }

    init() {
        klaw(path.join(__dirname, "..", "tasks")).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const taskType = require(path.join(file.dir, file.base));
            console.log(typeof taskType);
            console.log(taskType);
            this.taskTypes.set(file.name, taskType);
        }).on("end", () => {
            //this.taskInit();
            //this.startInterval();
        });
    }

    taskInit() {
        this.client.database.get("tasks").then(list => {
            list.forEach(task => {
                const taskType = this.taskTypes.get(task.type);

                this.tasks.set(
                    task.id,
                    new taskType(this.client, task)
                );
            });
        });
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.tasks
                .filter(task => Date.now() >= task.end)
                .forEach(task => task.execute());
        }, 1000);
    }

    idGenerate() {
        return 10e4 + Math.floor(Math.random() * (10e4 - 1));
    }

    async create(data, end) {
        const id = this.idGenerate();
        const newData = { id, end, data };

        await this.client.database.insert("tasks", newData);

        const taskType = this.taskTypes.get(data.type);
        const task = new taskType(this.client, newData);

        this.set(id, task);

        return task;
    }
};