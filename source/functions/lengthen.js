const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(type = -1, text, length, place = "after") {
        if (type === -1) {
            if (text.length > length) return `${text.substring(0, length - 3)}...`;
            return text;
        } else if (type === 1) {
            text = text.toString();
            if (text.length > length) return `${text.substring(0, length - 3)}...`;
            return place === "before" ?
                ' '.repeat(length - text.length) + text :
                text + ' '.repeat(length - text.length);
        }
    }
}

module.exports = New;
