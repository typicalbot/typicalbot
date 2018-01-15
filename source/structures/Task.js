class Task {
    constructor(client, { id, type, end, data }) {
        Object.defineProperty(this, "client", { value: client });

        this.id = id;

        this.type = type;

        this.end = end;
        
        Object.keys(data).forEach(k => this[k] = data[k]);
    }
}

module.exports = Task;
