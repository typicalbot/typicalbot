import Function from '../structures/Function';
import { TypicalGuildMessage } from '../types/typicalbot';

export default class Pagify extends Function {
    execute(message: TypicalGuildMessage, list: string[], page = 1) {
        const listSize = list.length;
        const pageCount = Math.ceil(listSize / 10);

        page = page > pageCount ? 0 : page - 1;

        const currentPage = list.splice(page * 10, 10);

        const pageContent = currentPage
            .map(
                (item, index) =>
                    `• ${this.client.helpers.lengthen.execute(
                        String(index + 1 + 10 * page),
                        String(10 + 10 * page).length,
                        'before'
                    )}: ${item}`
            )
            .join('\n');

        return message.translate('misc:PAGIFY', {
            page: page + 1,
            pages: pageCount,
            total: listSize.toLocaleString(),
            content: pageContent
        });
    }
}
