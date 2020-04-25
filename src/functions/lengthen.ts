import Function from '../lib/structures/Function';

export default class Lengthen extends Function {
    execute(text: string, length: number) {
        return text.length > length
            ? `${text.substring(0, length - 3)}...`
            : text;
    }
}
