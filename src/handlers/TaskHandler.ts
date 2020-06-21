import { join, parse } from 'path';
import { Collection } from 'discord.js';
import klaw from 'klaw';
import Cluster from '../lib/TypicalClient';
import Task from '../lib/structures/Task';
import { TaskOptions } from '../lib/types/typicalbot';

export default class TaskHandler {
    client: Cluster;

    collection: Collection<number, Task> = new Collection();

    taskTypes: Collection<string, any> = new Collection();

    constructor(client: Cluster) {
        this.client = client;

        const path = join(__dirname, '..', 'tasks');
        const start = Date.now();

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);

                if (!file.ext || file.ext !== '.js') return;

                const req = ((r) => r.default || r)(require(join(file.dir, file.base)));

                this.taskTypes.set(file.name, req);
            })
            .on('end', async () => {
                // eslint-disable-next-line no-console
                this.client.logger.info(`Loaded ${this.collection.size} Tasks in ${Date.now() - start}ms`);

                const list: TaskOptions[] = await this.client.handlers.database.get('tasks');
                for (const task of list) {
                    const taskType = this.taskTypes.get(task.type);
                    if (!taskType) continue;

                    this.collection.set(task.id, new taskType(this.client, task));
                }
            });

        setInterval(() => {
            this.collection
                .filter((task) => Date.now() >= task.end)
                .forEach(async (task) => {
                    await task.execute(task.data);
                    this.collection.delete(task.id);
                });
        }, 1000);
    }

    async create(type: string, end: number, data: unknown) {
        const id = 10e4 + Math.floor(Math.random() * (10e4 - 1));
        const payload = {
            id,
            type,
            end,
            data
        };

        await this.client.handlers.database.insert('tasks', payload);

        const Task = this.taskTypes.get(type);
        if (!type) return null;

        this.collection.set(id, new Task(this.client, payload));

        return Task;
    }

    async delete(id: number) {
        await this.client.handlers.database.delete('tasks', id.toString());
        this.collection.delete(id);
    }
}
