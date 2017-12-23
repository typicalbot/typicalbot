const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);

        this.mentionRegex = new RegExp(`^<@!?${this.client.config.id}>$`);
    }

    async execute(message) {
        console.log("MESSAGES!");
        if (message.author.bot) return;

        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;

            const command = await this.client.commands.fetch(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            command.execute(message);
        } else {
            if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

            const settings = await message.fetchSettings().catch(err => this.client.log(err, true)); message.guild.settings = settings;

            if (this.mentionRegex.test(message.content)) return message.reply(`This server's prefix is ${settings.prefix.custom ? settings.prefix.default ? `\`${this.client.config.prefix}\` or \`${settings.prefix.custom}\`` : `\`${settings.prefix.custom}\`` : `\`${this.client.config.prefix}\``}.`);

            const userPermissions = this.client.permissions.fetch(message.guild, message.author);
            if (userPermissions.level === -1) return;
            if (userPermissions.level < 2 && !settings.ignored.invites.includes(message.channel.id)) this.client.automod.inviteCheck(message);
            if (userPermissions.level < 2 && settings.ignored.commands.includes(message.channel.id)) return;

            const split = message.content.split(" ")[0];
            const prefix = this.client.functions.matchPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            const command = await this.client.commands.fetch(split.slice(prefix.length).toLowerCase(), settings.aliases);
            if (!command) return;

            const param = message.content.includes(" ") ? message.content.slice(message.content.indexOf(" ") + 1) : "";

            const accessLevel = this.client.functions.fetchAccess(message.guild);
            if (command.access && accessLevel.level < command.access) return message.error(`The server owner's access level is too low to execute that command. The command requires an access level of ${command.access}, but the owner only has a level of ${accessLevel.level} (${accessLevel.title}). The owner can raise their access level by donating $5 or more to TypicalBot.`);

            const mode = command.mode || "free";
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return message.error(`That command is not enabled on this server.`);

            if (userPermissions.level < command.permission) return message.error(this.client.functions.error("perms", command, userPermissions));

            const actualUserPermissions = this.client.permissions.fetch(message.guild, message.author, true);
            if (actualUserPermissions.level < command.permission) return message.error(this.client.functions.error("perms", command, actualUserPermissions));

            settings.embed && command.embedExecute ?
                command.embedExecute(message, param, userPermissions) :
                command.execute(message, param, userPermissions);
        }
    }
}

module.exports = New;
