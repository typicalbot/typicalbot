module.exports = {
    "play": {
        mode: "strict",
        usage: {"command": "play", "description": "Disabled."},
        execute: (message, client) => {
            return message.channel.sendMessage(`TypicalBot's music features have been disabled for the time being due to a problem with memory leaking. I, HyperCoder, am doing what I can to fix the problem. There's no estimate on when the music will be fixed, if ever. We ask for your cooperation and patience while I attempt to figure out the issue and get a fix.\n\n**Some progress is beginning. Join our server to check the progress!**\n${client.config.urls.server}\n\n*Thanks!*\n~ HyperCoder#2975`);
        }
    }
};
