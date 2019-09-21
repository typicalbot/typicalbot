export default class Markdown {
    /**
     * Apply bold formatting to text.
     * @param {string} text
     */
    static bold(text) {
        return `**${text}**`;
    }

    /**
     * Apply italtics formatting to text.
     * @param {string} text
     */
    static italics(text) {
        return `_${text}_`;
    }

    /**
     * Apply underline formatting to text.
     * @param {string} text
     */
    static underline(text) {
        return `__${text}__`;
    }

    /**
     * Apply monospace formatting to text.
     * @param {string} text
     */
    static monospace(text) {
        return `\`${text}\``;
    }

    /**
     * Apply codeblock formatting to text.
     * @param {string} language
     * @param {string} text
     */
    static codeblock(language, text) {
        return `\`\`\`${language}\n${text}\`\`\``;
    }

    /**
     * Apply spoiler formatting to text.
     * @param {string} text
     */
    static spoiler(text) {
        return `||${text}||`;
    }

    /**
     * Apply strike formatting to text.
     * @param {string} text
     */
    static strike(text) {
        return `~~${text}~~`;
    }

    /**
     * Apply quote formatting to text.
     * @param {string} text
     */
    static quote(text) {
        return `> ${text}`;
    }

    /**
     * Apply quoteblock formatting to text.
     * @param {string} text
     */
    static quoteblock(text) {
        return `>>> ${text}`;
    }

    /**
     * Creates a masked link with the provided url.
     * @param {string} text
     * @param {string} url
     */
    static link(text, url) {
        return `[${text}](${url})`;
    }
}
