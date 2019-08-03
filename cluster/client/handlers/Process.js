class ProcessHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        process.on("uncaughtException", err => this.log(err.stack, true));
        process.on("unhandledRejection", err => {
            if (!err) return;

            this.log(`Uncaught Promise Error:\n${err.stack || JSON.stringify(err) || err}`, true);
        });
    }

    log(message, error = false) {
        console[error ? "error" : "log"](message);
    }
}

module.exports = ProcessHandler;