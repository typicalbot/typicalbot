module.exports = {
    "reload": {
        mode: "strict",
        permission: 5,
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
        permission: 5,
        execute: (message, client, response) => {
            let text = message.content.slice(message.content.search(" ") + 1);
            client.transmit("announcement", text);
            response.reply(":ok_hand::skin-tone-2:");
        }
    },
    "shard": {
        mode: "strict",
        permission: 5,
        execute: (message, client, response) => {
            let match = /shard\s+(ping|restart|\d+)\s*(\d+)?/i.exec(message.content);
            if (!match) return response.error("Invalid command usage.");

            let action = match[1];
            let shard = match[2];

            if (action === "ping") {
                if (!shard) return response.error("No shard specified.");

                shard < 100 ?
                    client.transmit("shardping", { "channel": message.channel.id, shard }) :
                    client.functions.request(`https://typicalbot.com/shard-num/?guild_id=${shard}&shard_count=${client.shardCount}`).then(data => {
                        client.transmit("shardping", { "channel": message.channel.id, "shard": +data });
                    });
            } else if (action === "restart") {
                if (!shard) return response.error("No shard specified.");

                shard < 100 ?
                    client.transmit("restartshard", { shard }) :
                    client.functions.request(`https://typicalbot.com/shard-num/?guild_id=${shard}&shard_count=${client.shardCount}`).then(data => {
                        client.transmit("restartshard", { "shard": +data });
                    });
            } else {
                client.functions.request(`https://typicalbot.com/shard-num/?guild_id=${action}&shard_count=${client.shardCount}`).then(data => {
                    response.reply(`Guild ${action} is on Shard ${+data + 1} / ${client.shardCount}.`);
                });
            }
        }
    },
    "eval": {
        dm: true,
        mode: "strict",
        permission: 6,
        execute: (message, client, response, level) => {
            let code = message.content.slice(message.content.search(" ") + 1);
            try {
                let output = eval(code);
                response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`OUTPUT:\`\n\`\`\`\n${typeof output === "object" ? JSON.stringify(output, null, 4) : output}\n\`\`\``);
            } catch (err) {
                response.send(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`ERROR:\`\n\`\`\`${err}\n\`\`\``);
            }
        }
    }
};
