import Function from '../structures/Function';

export default class Lengthen extends Function {
    execute(text: string, length: number, place = 'after') {
        if (text.length > length) return `${text.substring(0, length - 3)}...`;

        const spaced = ' '.repeat(length - text.length);

        return place === 'before' ? `${spaced}${text}` : `${text}${spaced}`;
    }

    shorten(text: string, length: number) {
        return text.length > length
            ? `${text.substring(0, length - 3)}...`
            : text;
    }
}
