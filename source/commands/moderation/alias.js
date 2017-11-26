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

    async execute(message, permissionLevel) {
        const args = /alias(?:es)?\s+(add|remove)\s+([A-Za-z]+)(?:\s+([A-Za-z]+))?/i.exec(message.content);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const action = args[1], command = args[2], alias = args[3];

        if (action === "add") {
            if (!alias) return message.error(this.client.functions.error("usage", this));

            const cmd = await this.client.commands.get(command);
            if (!cmd) return message.error(`The provided command doesn't exist.`);

            const aliasList = message.guild.settings.aliases;
            const aliasListF = message.guild.settings.aliases.map(a => a.alias);
            if (aliasListF.includes(alias)) return message.error(`The given alias already points to the \`${(await this.client.commands.get(aliasList[aliasListF.indexOf(alias)].command)).name}\` command.`);

            aliasList.push({ alias, command: cmd.name });

            this.client.settings.update(message.guild.id, { aliases: aliasList })
                .then(() => message.success("Successfully added alias."))
                .catch(err => message.error("An error occured while adding the alias."));
        } else if (action === "remove") {
            const aliasList = message.guild.settings.aliases;
            const aliasListF = message.guild.settings.aliases.map(a => a.alias);
            if (!aliasListF.includes(command)) return message.error("The requested alias does not exist.");

            aliasList.splice(aliasListF.indexOf(command), 1);

            this.client.settings.update(message.guild.id, { aliases: aliasList })
                .then(() => message.success("Successfully removed alias."))
                .catch(err => message.error("An error occured while removing the alias."));
        }
    }
};
