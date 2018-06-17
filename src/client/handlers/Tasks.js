const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");

class TaskHandler extends Collection {
    constructor(client) {
        super();

        Object.defineProperty(this, "client", { value: client });

        this.taskTypes = new Collection();

        this.init();
    }

    init() {
        klaw(path.join(__dirname, "..", "tasks")).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const taskType = require(path.join(file.dir, file.base));

            this.taskTypes.set(file.name, taskType);
        }).on("end", () => {
            this.taskInit();
            this.startInterval();
        });
    }

    taskInit() {
        this.client.handlers.database.get("tasks").then(list => {
            list.forEach(task => {
                const taskType = this.taskTypes.get(task.type);

                this.set(
                    task.id,
                    new taskType(this.client, this, task)
                );
            });
        });
    }

    startInterval() {
        this.interval = setInterval(() => {
            this
                .filter(task => Date.now() >= task.end)
                .forEach(task => task.execute());
        }, 1000);
    }

    idGenerate() {
        return 10e4 + Math.floor(Math.random() * (10e4 - 1));
    }

    async create(type, end, data) {
        const id = this.idGenerate();
        const newData = { id, type, end, data };

        await this.client.handlers.database.insert("tasks", newData);

        const taskType = this.taskTypes.get(type);
        const task = new taskType(this.client, this, newData);

        this.set(id, task);

        return task;
    }

    async delete(id) {
        await this.client.handlers.database.delete("tasks", id);
        super.delete(id);

        return;
    }

    async clear(type, member) {
        const task = this.filter(t => t.guild === member.guild.id && t.member === member.id);
        if (!task.size) return;

        task.forEach(t => this.delete(t.id));

        return;
    }
}

module.exports = TaskHandler;