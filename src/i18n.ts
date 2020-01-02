import * as i18next from 'i18next';
import * as Backend from 'i18next-node-fs-backend';
import * as path from 'path';
import { promises as fs } from 'fs';

async function walkDirectory(
    dir: string,
    namespaces: string[] = [],
    folderName = ''
) {
    const files = await fs.readdir(dir);

    const languages: string[] = [];
    for (const file of files) {
        const stat = await fs.stat(path.join(dir, file));
        if (stat.isDirectory()) {
            const isLanguage = file.includes('-');
            if (isLanguage) languages.push(file);

            const folder = await walkDirectory(
                path.join(dir, file),
                namespaces,
                isLanguage ? '' : `${file}/`
            );

            // eslint-disable-next-line no-param-reassign
            namespaces = folder.namespaces;
        } else {
            namespaces.push(`${folderName}${file.substr(0, file.length - 5)}`);
        }
    }

    return { namespaces: [...new Set(namespaces)], languages };
}

export default async (): Promise<Map<string, i18next.TFunction>> => {
    const options = {
        jsonIndent: 2,
        loadPath: path.resolve(__dirname, '../../i18n/{{lng}}/{{ns}}.json')
    };

    const { namespaces, languages } = await walkDirectory(
        path.resolve(__dirname, '../../i18n')
    );

    i18next.use(Backend);

    await i18next.init({
        backend: options,
        debug: false,
        fallbackLng: 'en-US',
        initImmediate: false,
        interpolation: { escapeValue: false },
        load: 'all',
        ns: namespaces,
        preload: languages
    });

    return new Map(languages.map(item => [item, i18next.getFixedT(item)]));
};
