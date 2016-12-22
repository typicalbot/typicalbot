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
        permission: 4,
        execute: (message, client, response) => {
            let guild = message.content.split(" ")[1];

            client.functions.request(`https://typicalbot.com/shard-num/?guild_id=${guild}&shard_count=${client.shardCount}`).then(data => {
                response.reply(`Guild ${guild} is on Shard ${+data + 1} / ${client.shardCount}.`);
            });
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
