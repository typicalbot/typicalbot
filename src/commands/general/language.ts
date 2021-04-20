import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE } from '../../lib/utils/constants';
import { possibleLanguages } from '../administration/conf';

export default class extends Command {
    aliases = ['lang'];
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters?: string) {
        const settingsCommand = this.client.commands.get('conf');
        if (!settingsCommand) return;

        // No parameters were provided so use the menu style.
        if (!parameters) {
            const SET_LANGUAGE = message.translate('general/language:SET_LANGUAGE');
            const VIEW_LANGUAGES = message.translate('general/language:VIEW_LANGUAGES');
            const options = [
                SET_LANGUAGE,
                VIEW_LANGUAGES
            ];
            const selectedOption = await message.chooseOption(options);
            if (!selectedOption) {
                message.menuResponse?.delete().catch(() => undefined);
                return message.error(message.translate('common:INVALID_OPTION'));
            }

            switch (selectedOption) {
                case SET_LANGUAGE:
                    return this.setLanguage(message, settingsCommand);
                case VIEW_LANGUAGES:
                    message.menuResponse?.delete().catch(() => undefined);
                    return message.send(possibleLanguages
                        .map((language, index) => `**${index + 1}** - ${language.canonical}`)
                        .join('\n'));
                default:
                    return;
            }
        }

        // Parameters were provided by the user so we handle as necessary.
        return settingsCommand.execute(message, `language ${parameters}`);
    }

    async setLanguage(message: TypicalGuildMessage, settingsCommand: Command) {
        const languageName = await message.chooseOption(possibleLanguages.map((language) => language.canonical));
        message.menuResponse?.delete().catch(() => undefined);
        if (!languageName) return message.error(message.translate('common:INVALID_OPTION'));

        const languageToUse = possibleLanguages.find((language) => language.canonical === languageName);
        if (!languageToUse) return;

        const [alias] = languageToUse.aliases;
        return settingsCommand.execute(message, `language ${alias}`);
    }
}
