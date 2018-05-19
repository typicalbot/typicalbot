const { Structures, Guild, GuildMember, MessageEmbed, TextChannel, DMChannel, User, Message } = require("discord.js");
const VoiceConnection = require("discord.js/src/client/voice/VoiceConnection");
const Stream = require("../structures/Stream");

/*
    Structures.extend('Guild', Guild => {
        class CoolGuild extends Guild {
            constructor(client, data) {
            super(client, data);
            this.cool = true;
            }
        }

        return CoolGuild;
    });
*/

Structures.extend("Guild", structure =>
    class extends structure {
        fetchSettings() {
            return this.client.settings.fetch(this.id);
        }

        fetchPermissions(member, ignoreStaff = false) {
            return this.client.handlers.permissions.fetch(this, member, ignoreStaff);
        }
    }
);

Structures.extend("GuildMember", structure =>
    class extends structure {
        fetchPermissions(ignoreStaff = false) {
            return this.client.handlers.permissions.fetch(this.guild, this, ignoreStaff);
        }
    }
);

/*Structures.extend("MessageEmbed", structure =>
    class extends structure {
        send(content, options = {}) {
            if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
            return this.sendToChannel.send(content || "", Object.assign(options, { embed: this })).catch(() => { });
        }
    }
);*/
MessageEmbed.prototype.send = function(content, options = {}) {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
    return this.sendToChannel.send(content || "", Object.assign(options, { embed: this })).catch(() => { });
};

Structures.extend("TextChannel", structure =>
    class extends structure {
        buildEmbed() {
            return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
        }
    }
);

Structures.extend("User", structure =>
    class extends structure {
        buildEmbed() {
            return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
        }
    }
);

Structures.extend("DMChannel", structure =>
    class extends structure {
        buildEmbed() {
            return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
        }
    }
);

Structures.extend("Message", structure =>
    class extends structure {
        send(content, embed, options = {}) {
            if (embed) Object.assign(options, { embed });

            return this.channel.send(content, options).catch(() => { });
        }

        embed(embed) {
            return this.send("", embed);
        }

        reply(content, embed, options = {}) {
            return this.send(`${this.author} | ${content}`, embed, options);
        }

        success(content, embed, options = {}) {
            return this.send(`${this.author} | ✓ | ${content}`, embed, options);
        }

        error(content, embed, options = {}) {
            return this.send(`${this.author} | \\❌ | ${content}`, embed, options);
        }

        dm(content, embed, options = {}) {
            if (embed) Object.assign(options, { embed });

            this.author.send(content, options).catch(() => { });
        }

        buildEmbed() {
            return this.channel.buildEmbed();
        }
    }
);

/*
Structures.extend("VoiceConnection", structure =>
    class extends structure {
        constructor(...args) {
            super(...args);

            this._guildSteam = null;
        }

        get guildStream() {
            if (!this._guildStream) this._guildStream = new Stream(this.client, this);

            return this._guildStream;
        }

    }
);*/

Object.defineProperty(VoiceConnection.prototype, "guildStream", {
    get() {
        if (!this._guildStream) this._guildStream = new Stream(this.client, this);
        return this._guildStream;
    }
});