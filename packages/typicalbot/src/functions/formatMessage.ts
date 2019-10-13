import * as moment from 'moment';
import Function from '../structures/Function';
import { TypicalGuild, FormatMessageOptions } from '../types/typicalbot';
import { User } from 'discord.js';

export default class FormatMessage extends Function {
    async execute(
        type: string,
        guild: TypicalGuild,
        user: User,
        content: string,
        options: FormatMessageOptions
    ) {
        const member = await guild.members.fetch(user.id).catch(() => null);

        content = content
            .replace(/@everyone/gi, '@\u200Beveryone')
            .replace(/@here/g, '@\u200Bhere');

        if (type === 'logs') return this.logs(content, guild, user);
        if (type === 'logs-nick') {
            return this.logs(content, guild, user)
                .replace(
                    /{user.nick}|{user.nickname}/gi,
                    member ? member.displayName : user.username
                )
                .replace(
                    /{user.oldnick}|{user.oldnickname}/gi,
                    options.oldMember
                        ? options.oldMember.displayName
                        : user.username
                );
        }
        if (type === 'logs-invite') {
            const formatted = this.logs(content, guild, user).replace(
                /{user.nick}|{user.nickname}/gi,
                member ? member.displayName : user.username
            );
            if (!options.channel) return formatted;

            return formatted
                .replace(/{channel}/gi, options.channel.toString())
                .replace(/{channel.name}/gi, options.channel.name)
                .replace(/{channel.id}/gi, options.channel.id);
        }
        if (type === 'logs-msgdel') {
            let formatted = this.logs(content, guild, user).replace(
                /{user.nick}|{user.nickname}/gi,
                member ? member.displayName : user.username
            );
            if (options.channel) {
                formatted
                    .replace(/{channel}/gi, options.channel.toString())
                    .replace(/{channel.name}/gi, options.channel.name)
                    .replace(/{channel.id}/gi, options.channel.id);
            }
            if (!options.message) return formatted;

            return formatted
                .replace(
                    /{message.content}|{message.text}/gi,
                    options.message.content
                )
                .replace(
                    /{message.content:short}|{message.text:short}/gi,
                    this.client.helpers.lengthen.shorten(
                        options.message.content,
                        100
                    )
                );
        }
        if (type === 'automessage') {
            return content
                .replace(/{user.name}/gi, user.username)
                .replace(/{user.id}/gi, user.id)
                .replace(
                    /{user.discrim}|{user.discriminator}/gi,
                    user.discriminator
                )
                .replace(/{guild.name}|{server.name}/gi, guild.name)
                .replace(/{guild.id}|{server.id}/gi, guild.id);
        }
        if (type === 'autonick') {
            return content
                .replace(/{user.name}/gi, user.username)
                .replace(
                    /{user.discrim}|{user.discriminator}/gi,
                    user.discriminator
                );
        }

        return content;
    }

    logs(content: string, guild: TypicalGuild, user: User) {
        return content
            .replace(/{user}|{user.mention}/gi, user.toString())
            .replace(/{user.name}/gi, user.username)
            .replace(/{user.id}/gi, user.id)
            .replace(/{user.avatar}/, user.displayAvatarURL())
            .replace(
                /{user.discrim}|{user.discriminator}/gi,
                user.discriminator
            )
            .replace(/{user.tag}/gi, user.tag)
            .replace(
                /{user.created}/,
                moment(user.createdAt).format('MMM DD, YYYY @ hh:mm A')
            )
            .replace(/{guild.name}|{server.name}/gi, guild.name)
            .replace(/{guild.id}|{server.id}/gi, guild.id)
            .replace(
                /{guild.members}|{server.members}/gi,
                guild.memberCount.toString()
            )
            .replace(/{now}/gi, moment().format('dddd MMMM Do, YYYY, hh:mm A'))
            .replace(/{now.time}/gi, moment().format('hh:mm A'))
            .replace(/{now.date}/gi, moment().format('MMM DD, YYYY'));
    }
}
