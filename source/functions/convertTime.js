const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(t) {
        const ms = parseInt((t)%1000);
        const absoluteSeconds = parseInt((t/(1000))%60);
        const absoluteMinutes = parseInt((t/(1000*60))%60);
        const absoluteHours = parseInt((t/(1000*60*60))%24);
        const absoluteDays = parseInt((t/(1000*60*60*24)));

        const d = absoluteDays > 0 ? absoluteDays === 1 ? "1 day" : `${absoluteDays} days` : null;
        const h = absoluteHours > 0 ? absoluteHours === 1 ? "1 hour" : `${absoluteHours} hours` : null;
        const m = absoluteMinutes > 0 ? absoluteMinutes === 1 ? "1 minute" : `${absoluteMinutes} minutes` : null;
        const s = absoluteSeconds > 0 ? absoluteSeconds === 1 ? "1 second" : `${absoluteSeconds} seconds` : null;

        const absoluteTime = [];
        if (d) absoluteTime.push(d);
        if (h) absoluteTime.push(h);
        if (m) absoluteTime.push(m);
        if (s) absoluteTime.push(s);

        return absoluteTime.join(", ");
    }
}

module.exports = New;
