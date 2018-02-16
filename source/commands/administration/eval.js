const Command = require("../../structures/Command");
const Constants = require("../../utility/Constants");
const util = require("util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "An eval command for the creator.",
            usage: "eval <code>",
            permission: Constants.Permissions.Levels.TYPICALBOT_CREATOR,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        try {
            const args = /(return\s+)?(.+)$/i.exec(parameters);
            let code = parameters;

            if (!args[1]) code = code.replace(/(.+)$/, `return ${args[2]}`);

            const output = eval(`(async () => { ${code} })()`);

            output instanceof Promise ?
                output.then(a => {
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\n\n\`\`\`js\n${util.inspect(a, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    }).catch(err => {
                        message.embed({
                            "color": 0xFF0000,
                            "description": `\`\`\`\n${err.stack}\n\`\`\``,
                            "footer": {
                                "text": "TypicalBot Eval",
                                "icon_url": Constants.Links.ICON
                            }
                        });
                    });
                }).catch(err => {
                    message.embed({
                        "color": 0xFF0000,
                        "description": `\n\n\`\`\`\n${err ? err.stack : `Unknown Error`}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    });
                }) :
                output instanceof Object ?
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`js\n${util.inspect(output, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    }) :
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`\n${output}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    });
            //message.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`OUTPUT:\`\n\`\`\`\n${typeof output === "object" ? JSON.stringify(output, null, 4) : output}\n\`\`\``);
        } catch (err) {
            message.embed({
                "color": 0xFF0000,
                "description": `\`\`\`\n${err.stack}\n\`\`\``,
                "footer": {
                    "text": "TypicalBot Eval",
                    "icon_url": Constants.Links.ICON
                }
            }).catch(err => {
                message.reply("Cannot send embeds.");
            });

            //message.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`ERROR:\`\n\`\`\`${err}\n\`\`\``);
        }
    }
};
