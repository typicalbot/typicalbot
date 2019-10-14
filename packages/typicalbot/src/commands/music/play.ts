import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(.+)/i;
const urlRegex = /(?:(?:https?:\/\/www\.youtube\.com\/playlist\?list=(.+))|(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+))/i;

export default class extends Command {
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        if (
            !(await this.client.utility.music.hasPermissions(
                message,
                message.guild.settings.music.play
            ))
        )
            return;

        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
        args.shift();
        const [searchString] = args;

        const urlArgs = urlRegex.exec(parameters) || [];
        urlArgs.shift();

        const [playlist, url] = urlArgs;

        if (playlist)
            return this.client.handlers.music
                .stream(message, playlist, true)
                .catch(err => message.error(err.stack || err));

        if (url) {
            const info = await this.client.utility.music
                .fetchInfo(url, message)
                .catch(() => null);
            if (!info) return message.error(message.translate('play:NO_INFO'));

            const access = await this.client.helpers.fetchAccess.execute(
                message.guild
            );
            if (info.live && access.level < 1) {
                return message.error(message.translate('play:PRIME_ONLY'));
            }

            return this.client.handlers.music
                .stream(message, info)
                .catch(err => message.error(err.stack || err));
        }

        const data = await this.client.utility.music
            .search(message.guild.settings, searchString)
            .catch(error => {
                message.error(
                    this.client.utility.music.searchError(message, error)
                );
                return null;
            });
        if (!data) return null;

        if (!data.length) return message.reply(message.translate('play:NONE'));
        const [first] = data;

        const info = await this.client.utility.music
            .fetchInfo(first.url, message)
            .catch(error => {
                message.error(error.stack || error);
                return null;
            });
        if (!info) return null;

        return this.client.handlers.music.stream(message, info);
    }
}
