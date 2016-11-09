module.exports = {
    "play": {
        usage: {"command": "play <video_name/video_url>", "description": "Plays audio."},
        execute: (message, client) => {
            message.channel.sendMessage(`${message.author} | \`❌\` | Audio is currently disabled. Please join us at ${client.config.urls.server} and check our updates for more information. Sorry!`)
        }
    }
}
