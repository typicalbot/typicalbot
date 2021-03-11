import { encrypt as e, decrypt as d } from './cipher';
import { encode, decode } from './util';
import { resolve } from './key';

export const encrypt = (input: string, key: string): string => {
    const resolvedKey = resolve(key);

    const { iv, text } = e(resolvedKey, input);

    return `m.${encode(iv)}.${encode(text)}`;
};

export const decrypt = (input: string, key: string): string => {
    if (!input.startsWith('m.')) {
        throw new Error('Malformed message format');
    }

    const [, iv, text] = input.split('.');

    const resolvedKey = resolve(key);

    return d(resolvedKey, { iv: decode(iv), text: decode(text) });
};
