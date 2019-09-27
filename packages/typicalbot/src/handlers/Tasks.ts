import { Collection } from 'discord.js';
import { join, parse } from 'path';
import * as klaw from 'klaw';
import Cluster from '../index';
import { TaskOptions } from '../lib/types/typicalbot';
import Task from '../structures/Task';

export default class TaskHandler {
    client: Cluster;

    collection: Collection<number, Task> = new Collection();

    taskTypes: Collection<string, Task> = new Collection();

    constructor(client: Cluster) {
        this.client = client;

        const path = join(__dirname, '..', 'tasks');
        const start = Date.now();

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);

                if (!file.ext || file.ext !== '.js') return;

                // eslint-disable-next-line global-require, import/no-dynamic-require
                const req: Task = (r => r.default || r)(require(join(file.dir, file.base)));

                this.taskTypes.set(file.name, req);
            })
            .on('end', async () => {
                // eslint-disable-next-line no-console
                console.log(`Loaded ${this.collection.size} Tasks in ${Date.now() - start}ms`);

                const list: TaskOptions[] = await this.client.handlers.database.get('tasks');

                list.forEach((taskOptions) => this.collection.set(taskOptions.id, new Task(this.client, taskOptions)));
            });

        setInterval(() => {
            this.collection.filter((task) => Date.now() >= task.end)
                .forEach((task) => task.execute());
        }, 1000);
    }

    async taskInit() {
        const tasks: TaskOptions[] = await this.client.handlers.database.get('tasks')

        tasks.forEach((task) => this.collection.set(task.id, new Task(this.client, task)));
    }

    async create(type: string, end: number, data: unknown) {
        const id = 10e4 + Math.floor(Math.random() * (10e4 - 1));
        const payload = {
            id,
            type,
            end,
            data,
        };

        await this.client.handlers.database.insert('tasks', payload);

        const task = new Task(this.client, payload);

        this.collection.set(id, task);

        return task;
    }

    async delete(id: number) {
        await this.client.handlers.database.delete('tasks', id.toString());
        this.collection.delete(id);
    }

}
