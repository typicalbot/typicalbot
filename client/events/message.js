const Constants = require("../utility/Constants");
const Event = require("../structures/Event");
const { inspect } = require("util");

function matchPrefix(user, settings, command) {
    if (command.startsWith(this.client.config.prefix) && user.id === this.client.config.owner) return this.client.config.prefix;
    if (settings.prefix.custom && command.startsWith(settings.prefix.custom)) return settings.prefix.custom;
    if (settings.prefix.default && command.startsWith(this.client.config.prefix)) return this.client.config.prefix;
        
    return null;
}

function inviteCheck(message) {
    if (message.guild.settings.automod.invite) {
        if (
            /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(message.content) ||
            /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(inspect(message.embeds, { depth: 4 }))
        ) this.client.emit("guildInvitePosted", message);
    }
}

class Message extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(message) {
        if (message.author.bot) return;

        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;

            const command = await this.client.commands.fetch(message.content.split(" ")[0].slice(this.client.config.prefix.length));

            if (!command || !command.dm || command.permission > Constants.Permissions.Levels.SERVER_MEMBER) return;

            command.execute(message);
        } else {
            if (!message.guild.available || !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

            const settings = message.guild.settings = await message.guild.fetchSettings();
    
            if ((new RegExp(`^<@!?${this.client.user.id}>$`)).test(message.content))
                return message.reply(`This server's prefix is ${settings.prefix.custom ? settings.prefix.default ? `\`${this.client.config.prefix}\` or \`${settings.prefix.custom}\`` : `\`${settings.prefix.custom}\`` : `\`${this.client.config.prefix}\``}.`);
    
            const userPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author);
            const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);
    
            if (userPermissions.level < Constants.Permissions.Levels.SERVER_MODERATOR && !settings.ignored.invites.includes(message.channel.id)) inviteCheck(message).bind(this);
            if (userPermissions.level < Constants.Permissions.Levels.SERVER_MODERATOR && settings.ignored.commands.includes(message.channel.id)) return;
            if (userPermissions.level === Constants.Permissions.Levels.SERVER_BLACKLISTED) return;
    
            const split = message.content.split(" ")[0];
    
            const prefix = matchPrefix(message.author, settings, split).bind(this);
            if (!prefix || !message.content.startsWith(prefix)) return;
    
            const command = await this.client.commands.fetch(split.slice(prefix.length).toLowerCase(), settings);
            if (!command) return;
    
            if (command.ptb && this.client.build !== "ptb")
                return message.error("This command in is PTB mode, meaning it cannot be used on TypicalBot stable.");
    
            const accessLevel = await this.client.functions.fetchAccess(message.guild);
            if (command.access && accessLevel.level < command.access)
                return message.error(`The server owner's access level is too low to execute that command. The command requires an access level of ${command.access}, but the owner only has a level of ${accessLevel.level} (${accessLevel.title}). The owner can raise their access level by donating $5 or more to TypicalBot.`);
    
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID && command.mode < Constants.Modes[settings.mode.toUpperCase()])
                return message.error(`That command is not enabled on this server.`);
    
            if (userPermissions.level < command.permission || (actualUserPermissions.level < command.permission && actualUserPermissions.level !== Constants.Permissions.Levels.SERVER_BLACKLISTED && command.permission <= Constants.Permissions.Levels.SERVER_OWNER))
                return message.error(this.client.functions.error("perms", command, actualUserPermissions));
    
            const param = message.content.includes(" ") ? message.content.slice(message.content.indexOf(" ") + 1) : "";
            
            if (settings.embed && command.embedExecute && message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS"))
                return command.embedExecute(message, param, userPermissions);
    
            command.execute(message, param, userPermissions);
        }
    }
}

module.exports = Message;
