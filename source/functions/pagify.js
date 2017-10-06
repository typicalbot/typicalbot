const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(list, page = 1) {
        const listSize = list.length;
        const pageCount = Math.ceil(listSize / 10);
        page = page > pageCount ? 0 : page - 1;
        const currentPage = list.splice((page) * 10, 10);

        const pageContent = currentPage.map((item, index) => `• ${this.lengthen(1, (index + 1) + 10 * page, String(10 + (10 * page)).length, "before")}: ${item}`).join("\n");
        return `Page ${page + 1} / ${pageCount} | ${listSize.toLocaleString()} Total\n\n${pageContent}`;
    }
}

module.exports = New;
