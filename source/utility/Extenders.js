const { MessageEmbed, TextChannel, DMChannel, User, Message } = require("discord.js");

MessageEmbed.prototype.send = function(content) {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
    return this.sendToChannel.send(content || "", { embed: this });
};

TextChannel.prototype.buildEmbed = User.prototype.buildEmbed = DMChannel.prototype.buildEmbed = function() {
    return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
};

Message.prototype.send = function(content, embed, options) {
    if (embed) Object.defineProperty(options, { embed });
    
    return this.channel.send(content, options);
}

Message.prototype.reply = function(content, embed, options = {}) {
    return this.send(`${this.author} | ${content}`, embed);
}

Message.prototype.success = function(content, embed, options = {}) {
    return this.send(`${this.author} | ✓ | ${content}`, embed);
}

Message.prototype.error = function(content, embed, options = {}) {
    return this.send(`${this.author} | \\❌ | ${content}`, embed);
}

Message.prototype.dm = function(content, embed, options = {}) {
    if (embed) Object.defineProperty(options, { embed });
    
    this.author.send(content, options);
}

Message.prototype.buildEmbed = function() {
    return this.channel.buildEmbed();
}