const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Create an alias for commands.',
            usage: "alias <'list'|'add'|'remove'|'clear'> <add/remove:command> <add:new-alias>",
            aliases: ['aliases'],
            permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR,
            mode: Constants.Modes.STRICT,
            access: Constants.Access.Levels.DONOR,
        });
    }

    async execute(message, parameters) {
        const args = /(list|add|remove|clear)(?:\s+([A-Za-z]+)(?:\s+([A-Za-z]+))?)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const action = args[1]; const command = args[2]; const
            alias = args[3];

        if (action === 'list') {
            message.reply(`Current aliases:\n${message.guild.settings.aliases.length ? message.guild.settings.aliases.map((a) => `${a.alias} -> ${a.command}`).join('\n') : 'None'}`);
        } else if (action === 'add') {
            if (!command || !alias) return message.error(this.client.functions.error('usage', this));

            const cmd = await this.client.commands.fetch(command);
            if (!cmd) return message.error('The provided command doesn\'t exist.');

            const aliasList = message.guild.settings.aliases;
            const aliasListF = message.guild.settings.aliases.map((a) => a.alias);
            if (aliasListF.includes(alias)) return message.error(`The given alias already points to the \`${(await this.client.commands.fetch(aliasList[aliasListF.indexOf(alias)].command)).name}\` command.`);

            if (alias.length > 10) return message.error('You cannot create an alias longer than 10 characters.');

            aliasList.push({ alias, command: cmd.name });

            this.client.settings.update(message.guild.id, { aliases: aliasList })
                .then(() => message.success('Successfully added alias.'))
                .catch((err) => message.error('An error occured while adding the alias.'));
        } else if (action === 'remove') {
            if (!command) return message.error(this.client.functions.error('usage', this));

            const aliasList = message.guild.settings.aliases;
            const aliasListF = message.guild.settings.aliases.map((a) => a.alias);
            if (!aliasListF.includes(command)) return message.error('The requested alias does not exist.');

            aliasList.splice(aliasListF.indexOf(command), 1);

            this.client.settings.update(message.guild.id, { aliases: aliasList })
                .then(() => message.success('Successfully removed alias.'))
                .catch((err) => message.error('An error occured while removing the alias.'));
        } else if (action === 'clear') {
            this.client.settings.update(message.guild.id, { aliases: [] })
                .then(() => message.success('Successfully removed aliases.'))
                .catch((err) => message.error('An error occured while removing the alias.'));
        }
    }
};
