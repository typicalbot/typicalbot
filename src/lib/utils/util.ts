import { TypicalGuild, TypicalMessage, TypicalGuildMessage } from '../types/typicalbot';
import { AccessTitles } from './constants';

export const convertTime = (guild: TypicalGuild | TypicalMessage, time: number, short = false) => {
    const absoluteSeconds = Math.floor((time / 1000) % 60);
    const absoluteMinutes = Math.floor((time / (1000 * 60)) % 60);
    const absoluteHours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const absoluteDays = Math.floor(time / (1000 * 60 * 60 * 24) % 30.42);
    const absoluteMonths = Math.floor(time / (1000 * 60 * 60 * 24 * 30.42) % 12);
    const absoluteYears = Math.floor(time / (1000 * 60 * 60 * 24 * 30.42 * 12));

    const y = absoluteYears
        ? short ? guild.translate('time:SHORT_YEAR', { amount: absoluteYears }) : absoluteYears === 1
            ? guild.translate('time:ONE_YEAR')
            : guild.translate('time:YEARS', { amount: absoluteYears })
        : null;
    const mo = absoluteMonths
        ? short ? guild.translate('time:SHORT_MONTH', { amount: absoluteMonths }) : absoluteMonths === 1
            ? guild.translate('time:ONE_MONTH')
            : guild.translate('time:MONTHS', { amount: absoluteMonths })
        : null;
    const d = absoluteDays
        ? short ? guild.translate('time:SHORT_DAY', { amount: absoluteDays }) : absoluteDays === 1
            ? guild.translate('time:ONE_DAY')
            : guild.translate('time:DAYS', { amount: absoluteDays })
        : null;
    const h = absoluteHours
        ? short ? guild.translate('time:SHORT_HOUR', { amount: absoluteHours }) : absoluteHours === 1
            ? guild.translate('time:ONE_HOUR')
            : guild.translate('time:HOURS', { amount: absoluteHours })
        : null;
    const m = absoluteMinutes
        ? short ? guild.translate('time:SHORT_MINUTE', { amount: absoluteMinutes }) : absoluteMinutes === 1
            ? guild.translate('time:ONE_MINUTE')
            : guild.translate('time:MINUTES', { amount: absoluteMinutes })
        : null;
    const s = absoluteSeconds
        ? short ? guild.translate('time:SHORT_SECOND', { amount: absoluteSeconds }) : absoluteSeconds === 1
            ? guild.translate('time:ONE_SECOND')
            : guild.translate('time:SECONDS', { amount: absoluteSeconds })
        : null;

    const absoluteTime = [];
    if (y) absoluteTime.push(y);
    if (mo) absoluteTime.push(mo);
    if (d) absoluteTime.push(d);
    if (h) absoluteTime.push(h);
    if (m) absoluteTime.push(m);
    if (s) absoluteTime.push(s);

    return absoluteTime.join(', ');
};

export const fetchAccess = async (guild: TypicalGuild) => {
    if ((await guild.fetchPermissions(guild.ownerID)).level > 5)
        return AccessTitles.STAFF;

    return AccessTitles.DEFAULT;
};

export const lengthen = (text: string, length: number) => {
    return text.length > length
        ? `${text.substring(0, length - 3)}...`
        : text;
};

export const pagify = (message: TypicalGuildMessage, list: string[], page = 1) => {
    const listSize = list.length;
    const pageCount = Math.ceil(listSize / 10);

    page = page > pageCount ? 0 : page - 1;

    const currentPage = list.splice(page * 10, 10);

    const pageContent = currentPage
        .map((item, index) =>
            `• ${String(index + 1 + 10 * page).padStart(String(10 + 10 * page).length)}: ${item}`)
        .join('\n');

    return message.translate('misc:PAGIFY', {
        page: page + 1,
        pages: pageCount,
        total: listSize.toLocaleString(),
        content: pageContent
    });
};
