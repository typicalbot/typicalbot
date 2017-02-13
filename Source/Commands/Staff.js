const request = require("request");
const util = require("util");
const hd = require("heapdump");

function authorize(client, guildid, clientid) {
    return new Promise((resolve, reject) => {
        request({
            "method": "POST",
            "url": `https://discordapp.com/api/oauth2/authorize?client_id=${clientid}&scope=bot`,
            "headers": {
                "Authorization": `${client.config.authtoken}`,
                "Content-Type": "Application/JSON"
            },
            "body": JSON.stringify({
                "guild_id": guildid,
                "permissions": 0,
                "authorize": true
            })
        }, function(error, response, body) {
            if (error) return reject(`\`An error occured:\`\n\`\`\`${error}\`\`\``);
            body = JSON.parse(body);
            if (body.bot) return reject("Invalid Permissions.");
            if (body.client_id) return reject("Invalid Client ID.");
            if (body.location && body.location.startsWith("https://discordapp.com/oauth2/error")) return reject("Invalid Client ID.");
            if (response.statusCode !== 200) return reject(`\`An error occured:\`\n\`\`\`Status Code ${response.statusCode}\`\`\``);
            return resolve("Authorized!");
        });
    });
}

module.exports = {
    "reload": {
        mode: "strict",
        permission: 9,
        execute: (message, client, response) => {
            let mod = message.content.slice(message.content.search(" ") + 1);
            client.transmit("reload", mod);
            response.send("", {
                "color": 0x00FF00,
                "description": `**Reloading Module:** \`${mod}\``
            });
        }
    },
    "sannounce": {
        mode: "strict",
        permission: 9,
        execute: (message, client, response) => {
            let text = message.content.slice(message.content.search(" ") + 1);
            client.transmit("announcement", text);
            response.reply(":ok_hand::skin-tone-2:");
        }
    },
    "oauth": {
        mode: "strict",
        permission: 10,
        execute: (message, client, response) => {
            let clientid = message.content.slice(message.content.search(" ") + 1);
            authorize(client, message.guild.id, clientid).then(a => response.reply(a)).catch(e => response.error(e));
        }
    },
    "hdump": {
        mode: "strict",
        permission: 10,
        execute: (message, client, response) => {
            hd.writeSnapshot(`${__dirname}/${Date.now()}.heapsnapshot`);
        }
    },
    "shard": {
        mode: "strict",
        permission: 9,
        execute: (message, client, response) => {
            let match = /shard\s+(ping|restart|\d+)\s*(\d+)?/i.exec(message.content);
            if (!match) return response.error("Invalid command usage.");

            let action = match[1];
            let shard = match[2];

            if (action === "ping") {
                if (!shard) return response.error("No shard specified.");

                shard < 100 ?
                    client.transmit("shardping", { "channel": message.channel.id, shard, timestamp: Date.now() }) :
                    client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${shard}&shard_count=${client.shardCount}`).then(data => {
                        client.transmit("shardping", { "channel": message.channel.id, "shard": +data, timestamp: Date.now() });
                    });
            } else if (action === "restart") {
                if (!shard) return response.error("No shard specified.");

                shard < 100 ?
                    client.transmit("restartshard", { shard }) :
                    client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${shard}&shard_count=${client.shardCount}`).then(data => {
                        client.transmit("restartshard", { "shard": +data });
                    });
            } else {
                client.functions.request(`https://typicalbot.com/api/shard/?guild_id=${action}&shard_count=${client.shardCount}`).then(data => {
                    response.reply(`Guild ${action} is on Shard ${+data + 1} / ${client.shardCount}.`);
                });
            }
        }
    },
    "eval": {
        dm: true,
        mode: "strict",
        permission: 10,
        execute: (message, client, response, level) => {
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
    }
};
