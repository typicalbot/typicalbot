const request = require("superagent");
const moment = require("moment");
const util = require("util");
const Discord = require("discord.js");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    postStats(provider) {
        if (provider === "a" || provider === "c") {
            request.post("https://www.carbonitex.net/discord/data/botdata.php")
            .set("Content-Type", "application/json")
            .send({
                "key": this.client.config.carbonkey,
                "shardid": this.client.shardID.toString(),
                "shardcount": this.client.shardCount.toString(),
                "servercount": this.client.guilds.size.toString()
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) this.client.log("Carbinitex Stats Transfer Failed", true);
            });
        } else if (provider === "a" || provider === "b") {
            request.post("https://bots.discord.pw/api/bots/153613756348366849/stats")
            .set("Authorization", this.client.config.discordpwkey)
            .set("Content-Type", "application/json")
            .send({
                "shard_id": this.client.shardID.toString(),
                "shard_count": this.client.shardCount.toString(),
                "server_count": this.client.guilds.size.toString()
            })
            .end((err, res) => {
                if (err || res.statusCode != 200) this.client.log("bots.discord.pw Stats Transfer Failed", true);
            });
        }
    }

    transmitTesters() {
        const tester = this.client.guilds.get("163038706117115906").roles.find("name", "Beta Tester");
        const list = []; tester.members.forEach(m => list.push(m.id));
        this.client.transmit("testers", list);
    }

    checkTester(guild) {
        if (!this.client.testerData.includes(guild.ownerID) &&
            guild.ownerID !== this.client.config.owner &&
            !this.client.config.management[guild.ownerID] &&
            !this.client.config.staff[guild.ownerID] &&
            !this.client.config.support[guild.ownerID]
        ) return false;
        return true;
    }

    transmitDonors() {
        const donor = this.client.guilds.get("163038706117115906").roles.find("name", "Donor");
        const list = []; donor.members.forEach(m => list.push(m.id));
        this.client.transmit("donors", list);
    }

    checkDonor(guild) {
        if (!this.client.donorData.includes(guild.ownerID) &&
            guild.ownerID !== this.client.config.owner &&
            !this.client.config.management[guild.ownerID] &&
            !this.client.config.staff[guild.ownerID] &&
            !this.client.config.support[guild.ownerID]
        ) return false;
        return true;
    }

    convertTime(t) {
        const ms = parseInt((t)%1000);
        const absoluteSeconds = parseInt((t/(1000))%60);
        const absoluteMinutes = parseInt((t/(1000*60))%60);
        const absoluteHours = parseInt((t/(1000*60*60))%24);
        const absoluteDays = parseInt((t/(1000*60*60*24)));

        const d = absoluteDays > 0 ? absoluteDays === 1 ? "1 day" : `${absoluteDays} days` : null;
        const h = absoluteHours > 0 ? absoluteHours === 1 ? "1 hour" : `${absoluteHours} hours` : null;
        const m = absoluteMinutes > 0 ? absoluteMinutes === 1 ? "1 minute" : `${absoluteMinutes} minutes` : null;
        const s = absoluteSeconds > 0 ? absoluteSeconds === 1 ? "1 second" : `${absoluteSeconds} seconds` : null;

        const absoluteTime = [];
        if (d) absoluteTime.push(d);
        if (h) absoluteTime.push(h);
        if (m) absoluteTime.push(m);
        if (s) absoluteTime.push(s);

        return absoluteTime.join(", ");
    }

    lengthen(type = -1, text, length, place = "after") {
        if (type === -1) {
            if (text.length > length) return `${text.substring(0, length - 3)}...`;
            return text;
        } else if (type === 1) {
            text = text.toString();
            if (text.length > length) return `${text.substring(0, length - 3)}...`;
            return place === "before" ?
                ' '.repeat(length - text.length) + text :
                text + ' '.repeat(length - text.length);
        }
    }

    inviteCheck(text) {
        return /(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/.+/i.test(text);
    }

    fetchAutoRole(guild, settings) {
        const roleSetting = settings.auto.role.id; if (!roleSetting) return;

        if (guild.roles.has(roleSetting)) return guild.roles.get(roleSetting);
        return;
    }

    matchPrefix(user, settings, command) {
        if (command.startsWith(this.client.config.prefix) && user.id === this.client.config.owner) return this.client.config.prefix;
        if (settings.prefix.custom && command.startsWith(settings.prefix.custom)) return settings.prefix.custom;
        if (settings.prefix.default && command.startsWith(this.client.config.prefix)) return this.client.config.prefix;
        return null;
    }

    resolveMember(message, args) {
        return new Promise(async (resolve, reject) => {
            if (!args) return resolve(message.member);

            const id = args[1];
            const username = args[2], discriminator = args[3];

            if (id) {
                const member = await message.guild.fetchMember(id);
                return resolve(member || message.member);
            } else if (username && discriminator) {
                const memberList = await message.guild.fetchMembers({ "query": username });
                if (!memberList) return resolve(message.member);

                const member = memberList.find(m => m.user.discriminator === discriminator);
                return resolve(member || message.member);
            } else {
                return resolve(message.member);
            }
        });
    }

    formatMessage(type, guild, user, content, options = {}) {
        const member = guild.member(user);

        content = content.replace(/@everyone/gi, `@\u200Beveryone`).replace(/@here/g, `@\u200Bhere`);

        if (type === "logs") return content
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
        if (type === "logs-nick") return this.getFilteredMessage("logs", guild, user, content)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{user.oldnick}|{user.oldnickname}/gi, options.oldMember.nickname || user.username);
        if (type === "logs-invite") return this.getFilteredMessage("logs", guild, user, content)
            .replace(/{user.nick}|{user.nickname}/gi, member.nickname || user.username)
            .replace(/{channel}/gi, options.channel.toString())
            .replace(/{channel.name}/gi, options.channel.name)
            .replace(/{channel.id}/gi, options.channel.id);
        if (type === "logs-msgdel") return this.getFilteredMessage("logs", guild, user, content)
            .replace(/{message.content}|{message.text}/gi, options.message.content)
            .replace(/{message.content:short}|{message.text:short}/gi, this.shorten(options.message.content, 100))
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

    pagify(list, page = 1) {
        const listSize = list.length;
        const pageCount = Math.ceil(listSize / 10);
        page = page > pageCount ? 0 : page - 1;
        const currentPage = list.splice((page) * 10, 10);

        const pageContent = currentPage.map((item, index) => `• ${this.lengthen(1, (index + 1) + 10 * page, String(10 + (10 * page)).length, "before")}: ${item}`).join("\n");
        return `Page ${page + 1} / ${pageCount} | ${listSize.toLocaleString()} Total\n\n${pageContent}`;
    }
};
