module.exports = {
    "play": {
        mode: "strict",
        usage: {"command": "play", "description": "Disabled."},
        execute: (message, client) => {
            return message.channel.sendMessage(`TypicalBot's music features have been disabled for the time being due to a problem with memory leaking. I, HyperCoder, am doing what I can to fix the problem. There's no estimate on when the music will be fixed, if ever. We ask for your cooperation and patience  while I attempt to figure out the issue and get a fix.

*Thanks!*
~ HyperCoder#2975

While you're here: <http://www.strawpoll.me/11711229/>`);
        }
    }
};
