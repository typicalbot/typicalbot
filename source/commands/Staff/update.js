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

            const reply = [];

            if (stdout) reply.push(`STDOUT:\n- - - - - - - - - -\n${stdout}`);
            if (stderr) reply.push(`STDERR:\n- - - - - - - - - -\n${stderr}`);

            response.send(`\`\`\`\n${reply.join("\n--  --  --  --  --  --  --\n")}\n\`\`\``);
        });
    }
};
