const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Create an alias for commands.",
            usage: "alias <'add'|'remove'> <command> <if create:new-alias",
            aliases: ["aliases"],
            mode: "strict",
            permission: 3
        });
    }

    removeKey(list, key) {
        const sList = Object.keys(list);
        sList.splice(sList.indexOf(key), 1);

        const newList = {};
        sList.map(x => newList[x] = list[x]);

        return newList;
    }

    async execute(message, permissionLevel) {
        const args = /alias(?:es)?\s+(add|remove)\s+([A-Za-z]+)(?:\s+([A-Za-z]+))?/i.exec(message.content);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const action = args[1], command = args[2], alias = args[3];

        if (action === "add") {
            if (!alias) return message.error(this.client.functions.error("usage", this));

            const cmd = await this.client.commands.get(command);
            if (!cmd) return message.error(`The provided command doesn't exist.`);

            if (message.guild.settings.aliases[alias]) return message.error(`The given alias already points to the \`${(await this.client.commands.get(message.guild.settings.aliases[alias])).name}\` command.`);

            const list = message.guild.settings.aliases;
            list[alias] = cmd.name;

            this.client.settings.update(message.guild.id, { aliases: list })
                .then(() => message.success("Successfully added alias."))
                .cach(err => message.error("An error occured while adding the alias."));
        } else if (action === "remove") {
            if (!message.guild.settings.aliases[command]) return message.error("The request alias does not exist.");

            const list = this.removeKey(message.guild.settings.aliases, command);

            message.reply(list.toString());

            this.client.settings.update(message.guild.id, { aliases: null })
                .then(() => {
                    this.client.settings.update(message.guild.id, { aliases: list })
                        .then(() => message.success("Successfully removed alias."))
                        .cach(err => message.error("An error occured while removing the alias."));
                })
                .cach(err => message.error("An error occured while removing the alias."));
        }
    }
};
