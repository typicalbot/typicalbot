const Function = require("../structures/Function");
const moment = require("moment");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(type, guild, user, content, options = {}) {
        const member = guild.member(user);

        content = content.replace(/@everyone/gi, `@\u200Beveryone`).replace(/@here/g, `@\u200Bhere`);

        if (type === "logs") return content
            .replace(/{user}|{user.mention}/gi, user.toString())
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.id}/gi, user.id)
            .replace(/{user.avatar}/, user.avatarURL)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator)
            .replace(/{user.tag}/gi, `${user.username}#${user.discriminator}`)
            .replace(/{user.created}/, moment(user.createdAt).format("MMM DD, YYYY @ hh:mm A"))
            .replace(/{guild.name}|{server.name}/gi, guild.name)
            .replace(/{guild.id}|{server.id}/gi, guild.id)
            .replace(/{guild.members}|{server.members}/gi, guild.memberCount)
            .replace(/{now}/gi, moment().format("dddd MMMM Do, YYYY, hh:mm A"))
            .replace(/{now.time}/gi, moment().format("hh:mm A"))
            .replace(/{now.date}/gi, moment().format("MMM DD, YYYY"));
        if (type === "logs-nick") return this.formatMessage("logs", guild, user, content)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{user.oldnick}|{user.oldnickname}/gi, options.oldMember.nickname || user.username);
        if (type === "logs-invite") return this.formatMessage("logs", guild, user, content)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{channel}/gi, options.channel.toString())
            .replace(/{channel.name}/gi, options.channel.name)
            .replace(/{channel.id}/gi, options.channel.id);
        if (type === "logs-msgdel") return this.formatMessage("logs", guild, user, content)
            .replace(/{message.content}|{message.text}/gi, options.message.content)
            .replace(/{message.content:short}|{message.text:short}/gi, this.lengthen(-1, options.message.content, 100))
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{channel}/gi, options.channel.toString())
            .replace(/{channel.name}/gi, options.channel.name)
            .replace(/{channel.id}/gi, options.channel.id);
        if (type === "automessage") return content
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.id}/gi, user.id)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator)
            .replace(/{guild.name}|{server.name}/gi, guild.name)
            .replace(/{guild.id}|{server.id}/gi, guild.id);
        if (type === "autonick") return content
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator);
    }
}

module.exports = New;
