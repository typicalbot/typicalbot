import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';
import { possibleLanguages } from '../administration/settings';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters?: string) {
        // No parameters were provided so use the menu style.
        if (!parameters) {
            const SET_LANGUAGE = message.translate('core/language:SET_LANGUAGE');
            const VIEW_LANGUAGES = message.translate('core/language:VIEW_LANGUAGES')
            const options = [
                SET_LANGUAGE,
                VIEW_LANGUAGES
            ]
            const selectedOption = await message.chooseOption(options)
            if (!selectedOption) return message.error('common:INVALID_OPTION')

            switch (selectedOption) {
                case SET_LANGUAGE:
                    return this.setLanguage(message);
                case VIEW_LANGUAGES:
                    return message.send(possibleLanguages.map((language) => language.canonical).join('\n'));
                default:
                    return;
            }

        }

        // Parameters were provided by the user so we handle as necessary.
        const languageName = parameters.toLowerCase();
        const languageToUse = possibleLanguages.find((language) => language.name.toLowerCase() === languageName || language.aliases.includes(languageName));
        if (!languageToUse) return message.error(message.translate('core/language:INVALID', { names: possibleLanguages.map((language) => language.name).join(', ') }))

        if (!languageToUse.complete) message.reply(message.translate('core/language:INCOMPLETE', { name: languageToUse.canonical, link: `<${Constants.Links.TRANSLATE}>` }))

        await this.client.settings.update(message.guild.id, {
            language: languageToUse.name
        })
        return message.reply(message.translate('core/language:UPDATED_GUILD', { name: languageToUse.canonical }))
    }

    async setLanguage(message: TypicalGuildMessage) {
        const languageName = await message.chooseOption(possibleLanguages.map((language) => language.canonical))
        if (!languageName) return

        const languageToUse = possibleLanguages.find((language) => language.canonical === languageName)
        if (!languageToUse) return;

        const settingsCommand = this.client.commands.get('settings')
        if (!settingsCommand) return;

        return settingsCommand.execute(message, `edit language ${languageToUse.name}`)
    }
}
