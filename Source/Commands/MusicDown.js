module.exports = {
    "play": {
        mode: "light",
        usage: {"command": "play <video_name/video_url>", "description": "Plays audio."},
        execute: (message, client) => {
            message.channel.sendMessage(`${message.author} | \`❌\` | All music commands are currently disabled because it's causing some problems. These are hoped to be fixed soon. Please join us at ${client.config.urls.server} and check our updates for more information. Sorry!\n\nYou can join our partnered music server for some constant tunes! https://discord.gg/cX874pS`)
        }
    }
}
