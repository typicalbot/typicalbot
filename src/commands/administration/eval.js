const Command = require("../../structures/Command");
const Constants = require("../../utility/Constants");
const { VM } = require("vm2");
const { inspect } = require("util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "An eval command for the creator.",
            usage: "eval <code>",
            permission: Constants.Permissions.Levels.TYPICALBOT_MAINTAINER,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters) {
        try {
            const [arr, unsafe, code] = /^(-(?:u|unsafe)\s+)?([\W\w]+)/.exec(parameters);
            const vm = new VM();
            let result;

            if (unsafe) {
                result = eval(`(async () => { ${code} })()`);
            } else {
                result = vm.run(`(async () => { ${code} })()`);
            }

            result instanceof Promise ?
                result.then(a => {
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\n\n\`\`\`js\n${inspect(a, { depth: 0 })}\n\`\`\``,
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
                result instanceof Object ?
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`js\n${inspect(result, { depth: 0 })}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    }) :
                    message.embed({
                        "color": 0x00FF00,
                        "description": `\`\`\`\n${result}\n\`\`\``,
                        "footer": {
                            "text": "TypicalBot Eval",
                            "icon_url": Constants.Links.ICON
                        }
                    });
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
        }
    }
};
