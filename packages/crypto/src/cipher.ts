import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { Cipher } from './types/Cipher';

export const encrypt = (key: Uint8Array, message: string): Cipher => {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const encryptedMessage = cipher.update(message, 'utf8');

    cipher.final();

    const authTag = cipher.getAuthTag();

    return {
        iv,
        text: new Uint8Array(Buffer.concat([encryptedMessage, authTag]))
    };
};

export const decrypt = (key: Uint8Array, cipher: Cipher): string => {
    const decipher = createDecipheriv('aes-256-gcm', key, cipher.iv);

    const authTagLength = cipher.text.length - 16;
    const encryptedMessage = cipher.text.slice(0, authTagLength);
    const authTag = cipher.text.slice(authTagLength);

    decipher.setAuthTag(authTag);

    return decipher.update(encryptedMessage, undefined, 'utf8') + decipher.final('utf8');
};

