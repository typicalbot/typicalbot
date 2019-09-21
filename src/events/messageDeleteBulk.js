const moment = require('moment');
const fetch = require('node-fetch');
const Event = require('../structures/Event');

async function hastebin(input, options = {}) {
    if (typeof options === 'string') options = { url: 'https://www.hastebin.com', extension: options };

    const url = 'url' in options ? options.url : 'https://www.hastebin.com';
    const extension = 'extension' in options ? options.extension : 'js';

    const res = await fetch(`${url}/documents`, {
        method: 'post',
        body: input,
        headers: { 'Content-Type': 'text/plain' },
    });

    if (!res.ok) console.error(res.statusText);

    const { key } = await res.json();

    return `${url}/${key}.${extension}`;
}

class MessageBulkDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(messages) {
        const message = messages.first();

        if (message.channel.type !== 'text') return;
        if (!message.guild.available) return;

        const settings = await this.client.settings.fetch(message.guild.id).catch((err) => err);

        if (!settings.logs.id || !settings.logs.delete) return;

        const logsChannel = message.guild.channels.get(settings.logs.id);
        if (!logsChannel) return;

        const { channel } = message;

        const haste = await hastebin(messages.map((m) => `${moment(m.createdAt).format('dddd MMMM Do, YYYY, hh:mm A')} | ${m.author.tag} (${m.author.id}):\n${m.content}`).join('\n\n--  --  --  --  --\n\n'));

        if (settings.logs.delete === '--embed') {
            return logsChannel.buildEmbed()
                .setColor(0x3EA7ED)
                .setDescription(`${messages.size} messages were purged: ${haste}`)
                .setFooter(`Messages Purged in #${channel.name} (${channel.id})`)
                .setTimestamp()
                .send()
                .catch(() => { });
        }

        logsChannel.send(`${messages.size} messages were purged in ${channel.toString()} (${channel.id}): ${haste}`).catch(() => { });
    }
}

module.exports = MessageBulkDelete;
