const Command = require('../../structures/Command');
const Constants = require('../../utility/Constants');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Check the status of Discord.',
            usage: 'discordstatus',
            aliases: ['dstatus'],
            mode: Constants.Modes.LITE
        });
    }

    execute(message) {
        fetch('https://status.discordapp.com/api/v2/summary.json')
            .then(res => res.json())
            .then(json => {
                if (json.incidents.length === 0) return message.send('All systems are operational.');

                const incident = json.incident;

                message.send(`**Incident** at **${new Date(incident.created_at)}**\n${incident.incident_updates[0].body}`);
            })
            .catch(err => err ? null : message.error('An error occurred making that request.'));
    }
};
