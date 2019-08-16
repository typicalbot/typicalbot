const Command = require("../../structures/Command");
const Constants = require("../../utility/Constants");
const math = require("mathjs");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Evaluate math expressions.",
            usage: "math <expression>",
            aliases: ["calc", "math"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!parameters) return message.error(this.client.functions.error("usage", this));

        try {
            const result = math.evaluate(parameters);

            message.send(
                "**INPUT:**"
                + `\`\`\`\n`
                + `${parameters}`
                + `\`\`\`\n`
                + "**OUTPUT:**"
                + `\`\`\`\n`
                + `${result}`
                + `\`\`\``
            );
        } catch (e) {
            message.error("Failed to evaluate math expression.");
        }
    }
};
