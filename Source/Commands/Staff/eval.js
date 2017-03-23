const Command = require("../../Structures/Command.js");
const util = require("util");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            mode: "strict",
            permission: 10
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let code = message.content.slice(message.content.search(" ") + 1);
        try {
            let output = eval(code);

            output instanceof Promise ?
                output.then(a => {
                    response.send("", {
                        "color": 0x00FF00,
                        "description": `Promise Resolved:\n\n\`\`\`js\n${util.inspect(a, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    }).catch(err => {
                        response.send("", {
                            "color": 0xFF0000,
                            "description": `\`\`\`\n${err.stack}\n\`\`\``,
                            "footer": {
                                "text": "TypicalBot Eval",
                                "icon_url": "https://typicalbot.com/images/icon.png"
                            }
                        });
                    });
                }).catch(err => {
                    response.send("", {
                        "color": 0xFF0000,
                        "description": `Promise Rejected:\n\n\`\`\`\n${err.stack}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    });
                }) :
                output instanceof Object ?
                    response.send("", {
                        "color": 0x00FF00,
                        "description": `\`\`\`js\n${util.inspect(output, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    }) :
                    response.send("", {
                        "color": 0x00FF00,
                        "description": `\`\`\`\n${output}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": "https://typicalbot.com/images/icon.png"
                        }
                    });
            //response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`OUTPUT:\`\n\`\`\`\n${typeof output === "object" ? JSON.stringify(output, null, 4) : output}\n\`\`\``);
        } catch (err) {
            response.send("", {
                "color": 0xFF0000,
                "description": `\`\`\`\n${err.stack}\n\`\`\``,
                "footer": {
                    "text": "TypicalBot Eval",
                    "icon_url": "https://typicalbot.com/images/icon.png"
                }
            });

            //response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`ERROR:\`\n\`\`\`${err}\n\`\`\``);
        }
    }
};
