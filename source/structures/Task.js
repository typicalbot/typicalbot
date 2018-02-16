class Task {
    constructor(client, tasks, { id, type, end, data }) {
        Object.defineProperty(this, "client", { value: client });

        Object.defineProperty(this, "tasks", { value: tasks });

        this.id = id;

        this.type = type;

        this.end = end;
        
        Object.keys(data).forEach(k => this[k] = data[k]);
    }
}

module.exports = Task;
