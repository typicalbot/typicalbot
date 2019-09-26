import { Message } from 'discord.js'
import Command from '../../structures/Command';

export default class extends Command {

    static execute(message: Message) {
        const mention = message.mentions.users.first();
        const randomAddonNum = Math.random();
        let randomAddon = ''
        if (randomAddonNum <= 0.1) randomAddon = message.translate('shoot:POLICE')
        else if (randomAddonNum <= 0.2 && randomAddonNum > 0.1) randomAddon = message.translate('shoot:MISSED')
        else if (randomAddonNum <= 0.3 && randomAddonNum > 0.2) randomAddon = message.translate('shoot:HEADSHOT')

        // TODO: fix this if discord.js fixes partials behavior
        if (!mention || mention.id === (message.author && message.author.id)) return message.reply(`${message.translate('shoot:SELF')} ${randomAddon}`);
        return message.reply(`${message.translate('shoot:RESPONSE', { user: mention })} ${randomAddon}`);
    }
};
