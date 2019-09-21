const { Collection } = require('discord.js');
const { join, parse } = require('path');
const klaw = require('klaw');

class TaskHandler {
    constructor(client) {
        this.collection = new Collection();

        Object.defineProperty(this, 'client', { value: client });

        this.taskTypes = new Collection();

        const path = join(__dirname, '..', 'tasks');
        const start = Date.now();

        klaw(path).on('data', (item) => {
            const file = parse(item.path);

            if (!file.ext || file.ext !== '.js') return;

            const req = require(join(file.dir, file.base));

            this.taskTypes.set(file.name, req);
        }).on('end', async () => {
            console.log(`Loaded ${this.collection.size} Tasks in ${Date.now() - start}ms`);

            const list = await this.client.handlers.database.get('tasks');

            list.forEach((task) => {
                const taskType = this.taskTypes.get(task.type);

                this.collection.set(
                    task.id,
                    new taskType(this.client, this, task),
                );
            });
        });

        setInterval(() => {
            this.collection.filter((task) => Date.now() >= task.end)
                .forEach((task) => task.execute());
        }, 1000);
    }

    taskInit() {
        this.client.handlers.database.get('tasks').then((list) => {
            list.forEach((task) => {
                const taskType = this.taskTypes.get(task.type);

                this.collection.set(
                    task.id,
                    new taskType(this.client, this, task),
                );
            });
        });
    }

    idGenerate() {
        return 10e4 + Math.floor(Math.random() * (10e4 - 1));
    }

    async create(type, end, data) {
        const id = this.idGenerate();
        const newData = {
            id, type, end, data,
        };

        await this.client.handlers.database.insert('tasks', newData);

        const taskType = this.taskTypes.get(type);
        const task = new taskType(this.client, this, newData);

        this.collection.set(id, task);

        return task;
    }

    async delete(id) {
        await this.client.handlers.database.delete('tasks', id);
        this.collection.delete(id);
    }

    async clear(type, member) {
        const task = this.collection.filter((t) => t.guild === member.guild.id && t.member === member.id);
        if (!task.size) return;

        task.forEach((t) => this.collection.delete(t.id));
    }
}

module.exports = TaskHandler;
