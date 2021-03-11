export const encode = (input: Uint8Array): string => {
    return Buffer.from(input, 0, input.length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

export const decode = (input: string): Uint8Array => {
    const buffer = Buffer.from(input, 'base64');

    return new Uint8Array(buffer, 0, buffer.length);
};
