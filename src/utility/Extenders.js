const {
    Guild, GuildMember, MessageEmbed, TextChannel, DMChannel, User, Message,
} = require('discord.js');
const VoiceConnection = require('discord.js/src/client/voice/VoiceConnection');
const Stream = require('../structures/Stream');

Guild.prototype.buildModerationLog = async () => {
    this.client.handlers.moderationLog.buildCase(this);
};

Guild.prototype.fetchSettings = () => this.client.settings.fetch(this.id);

Guild.prototype.fetchPermissions = async (member, ignoreStaff = false) => this.client.handlers.permissions.fetch(this, member, ignoreStaff);

GuildMember.prototype.fetchPermissions = async (ignoreStaff = false) => this.client.handlers.permissions.fetch(this.guild, this, ignoreStaff);


MessageEmbed.prototype.send = (content, options = {}) => {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject('Embed not created in a channel');
    return this.sendToChannel.send(content || '', Object.assign(options, { embed: this })).catch(() => { });
};

DMChannel.prototype.buildEmbed = () => Object.defineProperty(new MessageEmbed(), 'sendToChannel', { value: this });
TextChannel.prototype.buildEmbed = () => Object.defineProperty(new MessageEmbed(), 'sendToChannel', { value: this });
User.prototype.buildEmbed = () => Object.defineProperty(new MessageEmbed(), 'sendToChannel', { value: this });

Message.prototype.send = (content, embed, options = {}) => {
    if (embed) Object.assign(options, { embed });
    this.channel.send(content, options).catch(() => { });
};

Message.prototype.embed = (embed) => this.send('', embed);

Message.prototype.error = (content, embed) => this.send(`${this.author} | ❌ | ${content}`, embed);

Message.prototype.reply = (content, embed) => this.send(`${this.author} | ${content}`, embed);

Message.prototype.success = (content, embed) => this.send(`${this.author} | ✔️ | ${content}`, embed);

Message.prototype.dm = (content, embed, options = {}) => {
    if (embed) Object.assign(options, { embed });
    this.author.send(content, options).catch(() => { });
};

Message.prototype.buildEmbed = () => this.channel.buildEmbed();

Object.defineProperty(VoiceConnection.prototype, 'guildStream', {
    get() {
        /* eslint-disable no-underscore-dangle */
        if (!this._guildStream) this._guildStream = new Stream(this.client, this);

        return this._guildStream;
    },
});
