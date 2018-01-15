class Task {
    constructor(client, { id, end, data }) {
        Object.defineProperty(this, "client", { value: client });

        this.id = id;

        this.end = end;
        
        Object.keys(data).forEach(k => this[k] = data[k]);
    }
}

module.exports = Task;
