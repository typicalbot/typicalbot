import { randomBytes } from 'crypto';
import { encode, decode } from './util';

export const generate = (): string => {
    const key = randomBytes(32);

    return format(key);
};

export const resolve = (input: string): Uint8Array => {
    if (!input.startsWith('k.')) {
        throw new Error('Malformed key format');
    }

    const [, key] = input.split('.');

    return decode(key);
};

export const format = (input: Uint8Array): string => {
    return `k.${encode(input)}`;
};
