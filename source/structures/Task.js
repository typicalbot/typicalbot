class Task {
    constructor(client, timers, { id, type, end, data }) {
        Object.defineProperty(this, "client", { value: client });

        Object.defineProperty(this, "timers", { value: timers });

        this.id = id;

        this.type = type;

        this.end = end;
        
        Object.keys(data).forEach(k => this[k] = data[k]);
    }
}

module.exports = Task;
