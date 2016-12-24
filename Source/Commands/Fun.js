module.exports = {
    "shoot": {
        usage: {"command": "shoot [@user]", "description": "'Shoot' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.array()[0];
            if (!user || user.id === message.author.id) return response.send(`${message.author} just shot themself! :scream:`);
            response.send(`${message.author} just shot ${user}! :scream: ${Math.floor(Math.random() * 4) === 3 ? `Someone call the police!` : ""}`);
        }
    },
    "stab": {
        usage: {"command": "stab [@user]", "description": "'Stab' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.array()[0];
            if (!user || user.id === message.author.id) return response.send(`${message.author} just stabbed themself! :knife::scream:`);
            response.send(`${message.author} just stabbed ${user}! :knife::scream: ${Math.floor(Math.random() * 4) === 3 ? `Someone call the police!` : ""}`);
        }
    },
    "salt": {
        usage: {"command": "salt [@user]", "description": "'Salt' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.array()[0];
            if (!user || user.id === message.author.id) return response.send(`${message.author} just salted themself. Wha?`);
            response.send(`${message.author} just salted ${user}! ${Math.floor(Math.random() * 4) === 3 ? `Someone get the snails away!` : ""}`);
        }
    },
    "8ball": {
        usage: {"command": "stab [@user]", "description": "'Stab' another user in the server."},
        execute: (message, client, response) => {
            if (!message.content.split(" ")[1]) return response.error(`${message.author} | \`❌\` | I can't respond to a non-existant question!`);
            let responses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook is good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
            response.reply(responses[Math.floor(Math.random() * responses.length)]);
        }
    },
    "cat": {
        aliases: ["kitty", "kitten"],
        usage: {"command": "cat", "description": "Gives you a random cat picture."},
        execute: (message, client, response) => {
            client.functions.request("http://random.cat/meow").then(data => {
                response.send(JSON.parse(data).file);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "dog": {
        aliases: ["puppy", "doggy"],
        usage: {"command": "dog", "description": "Gives you a random dog picture."},
        execute: (message, client, response) => {
            message.channel.sendFile("http://randomdoggiegenerator.com/randomdoggie.php", "doggie.jpg").catch(err =>
                response.error(`An error occured making that request.`));
        }
    },
    "bunny": {
        usage: {"command": "bunny", "description": "Gives you a bunny cat picture."},
        execute: (message, client, response) => {
            let type = Math.floor(Math.random() * 4) === 1 ? "gif" : "poster";
            client.functions.request(`https://api.bunnies.io/v2/loop/random/?media=${type}`).then(data => {
                response.send(JSON.parse(data).media[type]);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "penguin": {
        usage: {"command": "penguin", "description": "Gives you a random penguin picture."},
        execute: (message, client, response) => {
            client.functions.request("http://penguin.wtf/").then(data => {
                response.send(data);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "pug": {
        usage: {"command": "pug", "description": "Gives you a random pug picture."},
        execute: (message, client, response) => {
            client.functions.request("http://pugme.herokuapp.com/bomb?count=1").then(data => {
                response.send(JSON.parse(data).pugs[0]);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "tiger": {
        usage: {"command": "tiger", "description": "Gives you a random tiger picture."},
        execute: (message, client, response) => {
            client.functions.request("https://typicalbot.com/api/tiger/").then(data => {
                response.send(JSON.parse(data).response);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "joke": {
        usage: {"command": "joke", "description": "Gives you a random joke."},
        execute: (message, client, response) => {
            client.functions.request("http://tambal.azurewebsites.net/joke/random").then(data => {
                response.send(JSON.parse(data).joke);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "yomomma": {
        usage: {"command": "yomomma", "description": "Gives you a random yomomma joke."},
        execute: (message, client, response) => {
            client.functions.request("https://typicalbot.com/api/yomomma/").then(data => {
                response.send(JSON.parse(data).response);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "quote": {
        usage: {"command": "quote", "description": "Gives you a random quote."},
        execute: (message, client, response) => {
            client.functions.request("https://typicalbot.com/api/quotes/").then(data => {
                response.send(JSON.parse(data).response);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "dice": {
        usage: {"command": "dice [sides]", "description": "Gives you a random pug picture."},
        aliases: ["roll"],
        execute: (message, client, response) => {
            let sides = message.content.split(" ")[1];
            sides = sides ? Number(sides) : 6;
            if (sides < 2 || sides > 100 || sides % 1 !== 0) return response.error(`Invalid number of sides. The number must be an integer greater than 1 and no more than 100.`);
            response.reply(`I rolled a **__${Math.floor(Math.random() * sides) + 1}__**.`);
        }
    }
};
