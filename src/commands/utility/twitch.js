const fetch = require('node-fetch');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            usage: 'twitch <user>',
        });
    }

    execute(message, parameters) {
        const args = /(.*)/gi.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const name = args[1];

        fetch(`https://api.twitch.tv/helix/users?login=${name}`, { method: 'get', headers: { 'Client-ID': this.client.config.apis.twitch } })
            .then((res) => res.json())
            .then((json) => {
                const data = json.data[0];
                message.reply(
                    `**__Twitch Statistics:__** ${data.display_name}\n`
                    + '```\n'
                    + `ID                  : ${data.id}\n`
                    + `Display Name        : ${data.display_name}\n`
                    + `Description         : ${data.description}\n`
                    + `Status              : ${data.broadcaster_type}\n`
                    + `Profile Picture     : ${data.profile_image_url}\n`
                    + `Total Views         : ${data.view_count}\n`
                    + '```',
                );
            })
            .catch((err) => message.error('An error occurred making that request.'));
    }

    embedExecute(message, parameters) {
        const args = /(.*)/gi.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const name = args[1];

        fetch(`https://api.twitch.tv/helix/users?login=${name}`, { method: 'get', headers: { 'Client-ID': this.client.config.apis.twitch } })
            .then((res) => res.json())
            .then((json) => {
                const data = json.data[0];

                message.buildEmbed()
                    .setColor(0x00adff)
                    .setTitle('Twitch Statistics')
                    .setDescription(data.description)
                    .addField('» ID', data.id, true)
                    .addField('» Display Name', data.display_name, true)
                    .addField('» Status', data.broadcaster_type, true)
                    .addField('» Total Views', data.view_count, true)
                    .setThumbnail(data.profile_image_url)
                    .send();
            })
            .catch((err) => message.error('An error occurred making that request.'));
    }
};
