const Event = require("../structures/Event");
const Response = require("../structures/Response");

class New extends Event {
    constructor(client, name) {
        super(client, name);

        this.mentionRegex = new RegExp(`^<@!?${this.client.config.id}>$`);
    }

    async execute(message) {
        if (message.author.bot) return;

        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            
            const command = await this.client.commands.get(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            const response = new Response(this.client, message);
            command.execute(message, response);
        } else {
            if (message.guild.me && !message.guild.me.hasPermission("SEND_MESSAGES")) return;

            const settings = await this.client.settings.fetch(message.guild.id).catch(err => { return err; });

            if (message.content.match(this.mentionRegex)) return message.channel.send(`${message.author} | This server's prefix is ${settings.prefix.custom ? settings.prefix.default ? `\`${this.client.config.prefix}\` or \`${settings.prefix.custom}\`` : `\`${settings.prefix.custom}\`` : `\`${this.client.config.prefix}\``}.`);

            message.guild.settings = settings;

            const userPermissions = this.client.permissionsManager.get(message.guild, message.author);
            if (userPermissions.level === -1) return;

            const response = new Response(this.client, message);
            if (userPermissions.level < 2 && !settings.ignored.invites.includes(message.channel.id)) this.client.automod.inviteCheck(response);

            if (userPermissions.level < 2 && settings.ignored.commands.includes(message.channel.id)) return;

            const split = message.content.split(" ")[0];
            const prefix = this.client.functions.matchPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            const command = await this.client.commands.get(split.slice(prefix.length).toLowerCase());
            if (!command) return;

            const mode = command.mode || "free";
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

            if (userPermissions.level < command.permission) return response.perms(command, userPermissions);

            const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);
            if (actualUserPermissions.level < command.permission) return response.perms(command, actualUserPermissions);

            settings.embed && command.embedExecute ?
                command.embedExecute(message, response, userPermissions) :
                command.execute(message, response, userPermissions);
        }
    }
}

module.exports = New;
