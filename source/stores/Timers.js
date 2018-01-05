const Store = require("../structures/Store");
const path = require("path");

class TimerStore extends Store {
    constructor(client) {
        super(client, "timers", path.join(__dirname, "..", "timers"));

        this.loadAll().then(() => this.interval());

        this.intervals = [];
    }

    interval() {
        this.intervals.push(setInterval(() => {
            this.forEach(t => {
                t.filter(e => Date.now() >= e.end).forEach(e => t.execute(e));
            });
        }, 1000));
    }
}

module.exports = TimerStore;
