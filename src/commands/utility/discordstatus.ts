import fetch from 'node-fetch';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['dstatus'];
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage) {
        const data = await fetch(
            'https://status.discordapp.com/api/v2/summary.json'
        )
            .then((res) => res.json())
            .catch(() => null);
        if (!data)
            return message.error(message.translate('common:REQUEST_ERROR'));

        if (!data.incidents.length)
            return message.send(
                [
                    message.translate('utility/discordstatus:OPERATIONAL'),
                    '',
                    '<https://status.discordapp.com>'
                ].join('\n')
            );

        const [incident] = data.incidents;

        return message.send(
            [
                message.translate('utility/discordstatus:INCIDENT', {
                    time: new Date(incident.created_at)
                }),
                incident.incident_updates[0].body,
                '',
                `<https://status.discordapp.com/incidents/${incident.incident_id}>`
            ].join('\n')
        );
    }
}
