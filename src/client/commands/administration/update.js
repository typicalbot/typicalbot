const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);
const { exec } = require("child_process");
const { join } = require("path");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "A command to update and restart the bot.",
            usage: "update ['-r'|'--restart']",
            permission: Constants.Permissions.Levels.TYPICALBOT_MAINTAINER,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const restart = /update\s+(?:-r|--restart)/.test(message.content);

        const path = process.cwd();

        exec("git pull", { cwd: path }, (err, stdout, stderr) => {
            if (err) return console.error(err);

            const embed = message.buildEmbed().setTitle("TypicalBot Updater").setFooter("TypicalBot", Constants.Links.ICON).setColor(0x00adff);

            if (stdout) embed.addField("» STDOUT", stdout.toString().substring(0, 1024));
            if (stderr) embed.addField("» STDERR", stderr.toString().substring(0, 1024));

            embed.send();

            if (restart) {
                message.reply("Are you sure?");

                message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000, errors: ["time"] })
                    .then(messages => {
                        const msg = messages.first();

                        if (msg.content.toLowerCase() !== "y" && msg.content.toLowerCase() !== "yes") return message.reply("Canceling.");

                        message.reply("Restarting now...");

                        exec(`pm2 restart ${
                            this.client.build === "stable" ?
                                "TB" : this.client.build === "prime" ?
                                    "TBP" : this.client.build === "beta" ?
                                        "TBB" : this.client.build === "development" ?
                                            "TBD" : null}`,
                        { cwd: path, env: { HOME: "/home/hypercoder" } },
                        (err, stdout, stderr) => {
                            if (err) return console.error(err);
                        });
                    }).catch(err => {
                        message.error("An answer was not given.");
                    });
            }
        });
    }
};
