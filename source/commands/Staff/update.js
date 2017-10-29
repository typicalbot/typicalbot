const Command = require("../../structures/Command");
const { exec } = require("child_process");
const { join } = require("path");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            mode: "strict",
            permission: 10
        });
    }

    execute(message, response, permissionLevel) {
        const restart = /update\s+(?:-r|--restart)/.test(message.content);

        const path = process.cwd();

        exec("git pull", { cwd: path }, (err, stdout, stderr) => {
            if (err) return console.error(err);

            const embed = response.buildEmbed().setTitle("TypicalBot Updater").setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png").setColor(0x00adff);

            if (stdout) embed.addField("» STDOUT", stdout.toString().substring(0, 1024));
            if (stderr) embed.addField("» STDERR", stderr.toString().substring(0, 1024));

            if (restart) embed.addField("\u200B", "Restarting now...");

            if (restart) exec(`pm2 restart ${
                this.client.build === "stable" ?
                    "TB" : this.client.build === "prime" ?
                        "TBP" : this.client.build === "beta" ?
                            "TBB" : this.client.build === "development" ?
                                "TBD" : null }`,
            { cwd: path, env: { HOME: "/home/hypercoder" } },
            (err, stdout, stderr) => {
                if (err) return console.error(err);
            });

            embed.send();
        });
    }
};
