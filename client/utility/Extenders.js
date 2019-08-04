const { Guild, GuildMember, MessageEmbed, TextChannel, DMChannel, User, Message } = require("discord.js");
const VoiceConnection = require("discord.js/src/client/voice/VoiceConnection");
const Stream = require("../structures/Stream");

Guild.prototype.fetchSettings = function() {
    return this.client.settings.fetch(this.id);
};

Guild.prototype.fetchPermissions = async function(member, ignoreStaff = false) {
    return this.client.handlers.permissions.fetch(this, member, ignoreStaff);
};

Guild.prototype.buildModerationLog = async function() {
    this.client.handlers.moderationLog.buildCase(this);
};

GuildMember.prototype.fetchPermissions = async function(ignoreStaff = false) {
    return this.client.handlers.permissions.fetch(this.guild, this, ignoreStaff);
};

MessageEmbed.prototype.send = function(content, options = {}) {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
    return this.sendToChannel.send(content || "", Object.assign(options, { embed: this })).catch(() => { });
};

TextChannel.prototype.buildEmbed = User.prototype.buildEmbed = DMChannel.prototype.buildEmbed = function() {
    return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
};

Message.prototype.send = function(content, embed, options = {}) {
    if (embed) Object.assign(options, { embed });

    return this.channel.send(content, options).catch(() => { });
};

Message.prototype.embed = function(embed) {
    return this.send("", embed);
};

Message.prototype.reply = function(content, embed, options = {}) {
    return this.send(`${this.author} | ${content}`, embed);
};

Message.prototype.success = function(content, embed, options = {}) {
    return this.send(`${this.author} | :typicalbotsuccesstoon: | ${content}`, embed);
};

Message.prototype.error = function(content, embed, options = {}) {
    return this.send(`${this.author} | :typicalboterrortoon: | ${content}`, embed);
};

Message.prototype.dm = function(content, embed, options = {}) {
    if (embed) Object.assign(options, { embed });

    this.author.send(content, options).catch(() => { });
};

Message.prototype.buildEmbed = function() {
    return this.channel.buildEmbed();
};

Object.defineProperty(VoiceConnection.prototype, "guildStream", {
    get() {
        if (!this._guildStream) this._guildStream = new Stream(this.client, this);

        return this._guildStream;
    }
});