module.exports = {
    "shoot": {
        usage: {"command": "shoot [@user]", "description": "'Shoot' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();
            let level = client.functions.getPermissionLevel(message.guild, message.guild.settings, user);

            let r_addition = Math.floor(Math.random() * 9);
            let addition = r_addition === 1 ? `Someone call the police!` : r_addition === 3 ? "Wait! They missed!" : r_addition === 5 ? "Bam! Headshot!" : null;

            if (level === 10 || level === 9) addition = "Wait! They missed!";
            if (level === 8 || level == 7) addition = "Bam! Headshot!";

            if (!user || user.id === message.author.id) return response.send(`${message.author} just shot at themselves! :scream:${addition ? ` ${addition}` : ""}`);
            response.send(`${message.author} just shot at ${user}! :scream:${addition ? ` ${addition}` : ""}`);
        }
    },
    "stab": {
        usage: {"command": "stab [@user]", "description": "'Stab' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            let r_addition = Math.floor(Math.random() * 4);
            let addition = r_addition === 1 ? `Someone call the police!` : null;

            if (!user || user.id === message.author.id) return response.send(`${message.author} just stabbed themselves! :dagger::scream:${addition ? ` ${addition}` : ""}`);
            response.send(`${message.author} just stabbed ${user}! :dagger::scream:${addition ? ` ${addition}` : ""}`);
        }
    },
    "slap": {
        usage: {"command": "slap [@user]", "description": "'Slap' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            let r_addition = Math.floor(Math.random() * 4);
            let addition = r_addition === 1 ? `Oh, dang! That must've hurt!` : null;

            if (!user || user.id === message.author.id) return response.send(`${message.author}, stop hitting yourself! :dizzy_face::wave::skin-tone-2:`);
            response.send(`${message.author} just slapped ${user}! :dizzy_face::wave::skin-tone-2:${addition ? ` ${addition}` : ""}`);
        }
    },
    "punch": {
        usage: {"command": "punch [@user]", "description": "'Punch' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            let r_addition = Math.floor(Math.random() * 4);
            let addition = r_addition === 1 ? `Oh, dang! Right to the jaw! That must've hurt!` : null;

            if (!user || user.id === message.author.id) return response.send(`${message.author}, stop hitting yourself! :punch::skin-tone-2:`);
            response.send(`${message.author} just punched ${user}! :punch::skin-tone-2:${addition ? ` ${addition}` : ""}`);
        }
    },
    "salt": {
        usage: {"command": "salt [@user]", "description": "'Salt' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            let r_addition = Math.floor(Math.random() * 4);
            let addition = r_addition === 1 ? `Someone get the snails away!` : null;

            if (!user || user.id === message.author.id) return response.send(`${message.author} just salted themselves. Wha?`);
            response.send(`${message.author} just salted ${user}!${addition ? ` ${addition}` : ""}`);
        }
    },
    "hug": {
        usage: {"command": "hug [@user]", "description": "'Hug' another user in the server."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            let r_addition = Math.floor(Math.random() * 4);
            let addition = r_addition === 1 ? `Awwwww.` : null;

            if (!user || user.id === message.author.id) return response.send(`${message.author} just gave themselves a hug. :hugging: *That's not weird at all.* :eyes:`);
            response.send(`${message.author} just gave ${user} a hug. :hugging:${addition ? ` ${addition}` : ""}`);
        }
    },
    "cookie": {
        usage: {"command": "cookie [@user]", "description": "Give another user a cookie."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            if (!user || user.id === message.author.id) return response.send(`${message.author} decided to keep all of the cookies for himself! What a jerk! :angry:`);
            response.send(`${message.author} just gave ${user} a cookie. :cookie:`);
        }
    },
    "toast": {
        usage: {"command": "toast [@user]", "description": "Give another user some toast."},
        execute: (message, client, response) => {
            let user = message.mentions.users.first();

            if (!user || user.id === message.author.id) user = "themselves"; else user = `${user}`;

            let responses = [
                `${message.author} just gave ${user} burnt toast.`,
                `${message.author} just gave ${user} unbuttered toast.`,
                `${message.author} just gave ${user} toast.`,
            ];

            response.send(responses[Math.floor(Math.random() * responses.length)]);
        }
    },
    "8ball": {
        usage: {"command": "8ball <question>", "description": "Ask the magic 8ball a question."},
        execute: (message, client, response) => {
            if (!message.content.split(" ")[1]) return response.error(`I can't respond to a non-existant question!`);

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
            message.channel.send("", { files: ["http://randomdoggiegenerator.com/randomdoggie.php"] }).catch(err =>
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
            return response.error("This command has been disabled due to the lack of a working api.");
            /*client.functions.request("http://penguin.wtf/").then(data => {
                response.send(data);
            }).catch(err => response.error(`An error occured making that request.`));*/
        }
    },
    "pug": {
        usage: {"command": "pug", "description": "Gives you a random pug picture."},
        execute: (message, client, response) => {
            return response.error("This command has been disabled due to the lack of a working api.");
            /*client.functions.request("http://pugme.herokuapp.com/bomb?count=1").then(data => {
                response.send(JSON.parse(data).pugs[0]);
            }).catch(err => response.error(`An error occured making that request.`));*/
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
        usage: {"command": "dice [sides]", "description": "Roles a random number for you."},
        aliases: ["roll"],
        execute: (message, client, response) => {
            let sides = message.content.split(" ")[1];
            sides = sides ? Number(sides) : 6;
            if (sides < 2 || sides > 100 || sides % 1 !== 0) return response.error(`Invalid number of sides. The number must be an integer greater than 1 and no more than 100.`);
            response.reply(`I rolled a **__${Math.floor(Math.random() * sides) + 1}__**.`);
        }
    }
};
