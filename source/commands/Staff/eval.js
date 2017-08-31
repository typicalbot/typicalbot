const Command = require("../../structures/Command");
const util = require("util");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "eval",
            mode: "strict",
            permission: 10
        });
    }

    execute(message, response, permissionLevel) {
        const code = message.content.slice(message.content.search(" ") + 1);
        try {
            const output = eval(code);

            output instanceof Promise ?
                output.then(a => {
                    response.embed({
                        "color": 0x00FF00,
                        "description": `\n\n\`\`\`js\n${util.inspect(a, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    }).catch(err => {
                        response.embed({
                            "color": 0xFF0000,
                            "description": `\`\`\`\n${err.stack}\n\`\`\``,
                            "footer": {
                                "text": "TypicalBot Eval",
                                "icon_url": "https://typicalbot.com/images/icon.png"
                            }
                        });
                    });
                }).catch(err => {
                    response.embed({
                        "color": 0xFF0000,
                        "description": `\n\n\`\`\`\n${err ? err.stack : `Unknown Error`}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    });
                }) :
                output instanceof Object ?
                    response.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`js\n${util.inspect(output, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    }) :
                    response.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`\n${output}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    });
            //response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`OUTPUT:\`\n\`\`\`\n${typeof output === "object" ? JSON.stringify(output, null, 4) : output}\n\`\`\``);
        } catch (err) {
            response.embed({
                "color": 0xFF0000,
                "description": `\`\`\`\n${err.stack}\n\`\`\``,
                "footer": {
                    "text": "TypicalBot Eval",
                    "icon_url": "https://typicalbot.com/images/icon.png"
                }
            }).catch(err => {
                response.reply("Cannot send embeds.");
            });

            //response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`ERROR:\`\n\`\`\`${err}\n\`\`\``);
        }
    }
};
