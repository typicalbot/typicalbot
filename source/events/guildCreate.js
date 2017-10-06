const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(guild) {
        /*if (this.client.build === "development") {
            const check = this.client.functions.get("checkTester").execute(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }
        if (this.client.build === "prime") {
            const check = this.client.functions.get("checkDonor").execute(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }

        if (this.client.build === "stable") this.client.functions.get("postStats").execute("b");

        this.client.transmitStats();*/
    }
}

module.exports = New;
