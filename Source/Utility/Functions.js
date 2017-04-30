const request = require("request");
const moment = require("moment");
const util = require("util");

module.exports = class Functions {
    constructor(client) {
        this.client = client;
    }

    sendStats(post = "a") {
        try {
            if (post === "a" || post === "c") request({
                "method": "POST",
                "url": "https://www.carbonitex.net/discord/data/botdata.php",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "key": this.client.config.carbonkey,
                    "shardid": this.client.shardID.toString(),
                    "shardcount": this.client.shardCount.toString(),
                    "servercount": this.client.guilds.size.toString()
                })
            }, (err, res, body) => { if (err || res.statusCode != 200) this.client.log(`Carbon Post Failed\n\n${err || body}`, true); });

            if (post === "a" || post === "b") request({
                "method": "POST",
                "url": "https://bots.discord.pw/api/bots/153613756348366849/stats",
                "headers": {
                    "Authorization": this.client.config.discordpwkey,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "shard_id": this.client.shardID.toString(),
                    "shard_count": this.client.shardCount.toString(),
                    "server_count": this.client.guilds.size.toString()
                })
            }, (err, res, body) => { if (err || res.statusCode != 200) this.client.log("DiscordPW Post Failed", true); });
        } catch(err) {
            this.client.log(err, true);
        }
    }

    sendDonors() {
        let donor = this.client.guilds.get("163038706117115906").roles.find("name", "Donor");
        let list = []; donor.members.forEach(m => list.push(m.id));
        this.client.transmit("donors", list);
    }

    alphaCheck(g) {
        if (
            !this.client.donors.includes(g.ownerID) &&
            g.ownerID !== this.client.config.owner &&
            !this.client.config.management[g.ownerID] &&
            !this.client.config.staff[g.ownerID] &&
            !this.client.config.support[g.ownerID]
        ) return false;
        return true;
    }

    timestamp(ms) {
        let days = ms / 86400000;
        let d = Math.floor(days);
        let hours = (days - d) * 24;
        let h = Math.floor(hours);
        let minutes = (hours - h) * 60;
        let m = Math.floor(minutes);
        let seconds = (minutes - m) * 60;
        let s = Math.floor(seconds);
        return { d, h, m, s };
    }

    time(ts) {
        let d = ts.d > 0 ? ts.d === 1 ? "1 day" : `${ts.d} days` : null;
        let h = ts.h > 0 ? ts.h === 1 ? "1 hour" : `${ts.h} hours` : null;
        let m = ts.m > 0 ? ts.m === 1 ? "1 minute" : `${ts.m} minutes` : null;
        let s = ts.s > 0 ? ts.s === 1 ? "1 second" : `${ts.s} seconds` : null;
        let l = [];
        if (d) l.push(d); if (h) l.push(h); if (m) l.push(m); if (s) l.push(s);
        return l.join(", ");
    }

    length(s) {
        return this.time(this.timestamp(s * 1000));
    }

    shorten(text, length = 45) {
        if (text.length > length) return `${text.substring(0, length - 3)}...`;
        return text;
    }

    lengthen(text, length, place = "after") {
        text = text.toString();
        if (text.length > length) return `${text.substring(0, length - 3)}...`;
        return place === "before" ?
            ' '.repeat(length - text.length) + text :
            text + ' '.repeat(length - text.length);
    }

    inviteCheck(response) {
        if (response.message.author.id === "288828235628675072") return;

        if (response.message.guild.settings.antiinvite === "Y") {
            let expr = /(discord\.gg\/.+|discordapp\.com\/invite\/.+)/gi;

            let contentMatch = expr.test(response.message.content);

            let embedMatch = expr.test(util.inspect(response.message.embeds, { depth: 4 }));

            if (contentMatch || embedMatch) {
                if (!response.message.deletable) return;
                this.client.eventsManager.guildInvitePosted(response.message.guild, response.message, response.message.author);
                response.message.delete().then(() => {
                    response.error(`An invite was detected in your message. Your message has been deleted.`);
                });
            }
        }
    }

    get uptime() {
        return this.time(this.timestamp(this.client.uptime));
    }

    fetchAutoRole(guild, settings) {
        let roleSetting = settings.autorole;
        if (!roleSetting) return;

        if (guild.roles.has(roleSetting)) return guild.roles.get(roleSetting);
        return;
    }

    getPrefix(user, settings, command) {
        if (command.startsWith(this.client.config.prefix) && user.id === this.client.config.owner) return this.client.config.prefix;
        if (settings.customprefix && command.startsWith(settings.customprefix)) return settings.customprefix;
        if (settings.defaultprefix === "N" && command.startsWith(this.client.config.prefix)) return this.client.config.prefix;
        return null;
    }

    getFilteredMessage(type, guild, user, text, options = {}) {
        let member = guild.member(user);
        text = text
            .replace(/@everyone/gi, `@\u200Beveryone`)
            .replace(/@here/g, `@\u200Bhere`);
        if (type === "logs") return text
            .replace(/{user}|{user.mention}/gi, user.toString())
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.id}/gi, user.id)
            .replace(/{user.avatar}/, user.avatarURL)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator)
            .replace(/{user.created}/, moment(user.createdAt).format("MMM DD, YYYY @ hh:mm A"))
            .replace(/{guild.name}|{server.name}/gi, guild.name)
            .replace(/{guild.id}|{server.id}/gi, guild.id)
            .replace(/{guild.members}|{server.members}/gi, guild.memberCount)
            .replace(/{now}/gi, moment().format("dddd MMMM Do, YYYY, hh:mm A"))
            .replace(/{now.time}/gi, moment().format("hh:mm A"))
            .replace(/{now.date}/gi, moment().format("MMM DD, YYYY"));
        if (type === "logs-nick") return this.getFilteredMessage("logs", guild, user, text)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{user.oldnick}|{user.oldnickname}/gi, options.oldMember.nickname || user.username);
        if (type === "logs-invite") return this.getFilteredMessage("logs", guild, user, text)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{channel}/gi, options.channel.toString())
            .replace(/{channel.name}/gi, options.channel.name)
            .replace(/{channel.id}/gi, options.channel.id);
        if (type === "logs-msgdel") return this.getFilteredMessage("logs", guild, user, text)
            .replace(/{message.content}|{message.text}/gi, options.message.content)
            .replace(/{message.content:short}|{message.text:short}/gi, this.shorten(options.message.content, 100))
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{channel}/gi, options.channel.toString())
            .replace(/{channel.name}/gi, options.channel.name)
            .replace(/{channel.id}/gi, options.channel.id);
        if (type === "jm") return text
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.id}/gi, user.id)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator)
            .replace(/{guild.name}|{server.name}/gi, guild.name)
            .replace(/{guild.id}|{server.id}/gi, guild.id);
        if (type === "jn") return text
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.discrim}|{user.discriminator}/gi, user.discriminator);
    }

    request(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) =>{
                if (error || response.statusCode !== 200) return reject({error: error, response: response});
                return resolve(body);
            });
        });
    }

    pagify(content, page) {
        let pages = [];
        let currentPage = [];

        content.forEach((v, index) => {
            currentPage.push(v);
            if (currentPage.length >= 10 || content.length === index + 1 || content.size === index + 1) {
                pages.push(currentPage);
                currentPage = [];
            }
        });

        page = page && page > 0 && page <= pages.length ? page - 1 : 0;

        let thisPage = pages[page].map((item, index) =>
              `• ${this.lengthen((index+1)+10*page, String(10+(10*page)).length, "before")}: ${item}`
        ).join("\n");

        return `Page ${page + 1} / ${pages.length} | ${content.length} Items\n\n${thisPage}`;
    }

    page(array, page) {
        return array.splice((page -1) * 10, 10);
    }
};
