const Webcord = require("Webcord");
const WebhookClient = new Webcord.WebhookClient();
let webhook = WebhookClient.connect("233411483902410762", "-y8LT2tm-l9BubQW8HHeZMSlFYNZ49YdlqMHf1QD2_qFiW4NSFCshdqlzyInWor_Ftlm").then(w => webhook = w);

module.exports = {
    "reload": {
        mode: "strict",
        permission: 5,
        execute: (message, client) => {
            let mod = message.content.slice(message.content.search(" ") + 1);
            client.send("reload", "module", mod);
            message.channel.sendMessage(`Reloading module __\`${mod}\`__`);
        }
    },
    "announce": {
        mode: "strict",
        permission: 4,
        execute: (message, client) => {
            let text = message.content.slice(message.content.search(" ") + 1);
            webhook.sendSlack({
                "text": `[](<@&202467732975779850>)`,
                //"text": `[](<@everyone>)`,
                "attachments": [{
                    "fields": [{
                        "title": "Announcement",
                        "value": text
                    }],
                    "color": "#439FE0",
                    //"color": "danger",
                    "footer": `${message.author.username}#${message.author.discriminator}`,
                    "footer_icon": message.author.avatarURL ? message.author.avatarURL : "",
                    "ts": Date.now() / 1000
                }]
            }).then(re => message.reply(":thumbsup::skin-tone-2:")).catch(err => message.reply(":x:"));
        }
    },
    "usage": {
        mode: "strict",
        permission: 5,
        execute: (message, client) => {
            let mb = client.data.heap;
            let gb = mb / 1024;
            message.channel.sendMessage(`__\`TypicalBot Total Heap Usage:\`__\`\`\`\nMegabytes: ${mb}\nGigabytes: ${gb}\n\`\`\``);
        }
    },
    "eval": {
        dm: true,
        mode: "strict",
        permission: 5,
        execute: (message, client, level) => {
            let code = message.content.slice(message.content.search(" ") + 1);
            try {
                let output = eval(code);
                message.channel.sendMessage(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`OUTPUT:\`\n\`\`\`\n${typeof output === "object" ? JSON.stringify(output, null, 4) : output}\n\`\`\``);
            } catch (err) {
                message.channel.sendMessage(`\`INPUT:\`\n\`\`\`\n${code}\n\`\`\`\n\`ERROR:\`\n\`\`\`${err}\n\`\`\``);
            }
        }
    }
};
