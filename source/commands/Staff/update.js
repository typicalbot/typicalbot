const Command = require("../../structures/Command");
const { exec } = require("child_process");
const { join } = require("path");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            mode: "strict",
            permission: 10
        });
    }

    execute(message, response, permissionLevel) {
        exec("git pull", { cwd: join(__dirname, "..", "..", "..") }, (err, stdout, stderr) => {
            if (err) return console.error(err);

            const embed = response.buildEmbed().setTitle("TypicalBot Git-Pull").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png");

            if (stdout) embed.addField("STDOUT", stdout.toString().substring(0, 1024));
            if (stderr) embed.addField("STDERR", stderr.toString().substring(0, 1024));

            embed.send();
        });
    }
};
