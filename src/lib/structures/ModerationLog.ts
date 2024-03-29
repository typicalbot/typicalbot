import { MessageEmbed, User, TextChannel } from 'discord.js';
import TypicalClient from '../TypicalClient';
import { ModlogAction, TypicalGuild } from '../types/typicalbot';
import { MODERATION_LOG_TYPE, MODERATION_LOG_REGEX, LINK, WEBSITE } from '../utils/constants';
import { convertTime } from '../utils/util';

export default class ModerationLog {
    client: TypicalClient;
    guild: TypicalGuild;
    id = '';
    _id = '';
    action = '';
    _action: ModlogAction = MODERATION_LOG_TYPE.WARN;
    moderator = {
        display: '',
        icon: ''
    };

    user = '';
    channel = '';
    reason = '';
    expiration = 0;

    constructor(client: TypicalClient, guild: TypicalGuild) {
        this.client = client;
        this.guild = guild;
    }

    setId(data: number) {
        this._id = data.toString();
        this.id = this.guild.translate('moderation/modlog:CASE_ID', {
            id: data
        });
        return this;
    }

    setAction(data: ModlogAction) {
        this._action = data;
        this.action = this.guild.translate('moderation/modlog:ACTION', {
            display: data.display,
            expiration: this.expiration
                ? ` (${convertTime(this.guild, this.expiration)})`
                : ''
        });
        return this;
    }

    setModerator(data?: User) {
        if (data) {
            this.moderator = {
                display: `${data.tag} (${data.id})`,
                icon: data.displayAvatarURL()
            };
        }

        return this;
    }

    setUser(data: User) {
        this.user = this.guild.translate('moderation/modlog:USER', {
            tag: data.tag,
            id: data.id
        });
        return this;
    }

    setChannel(data: TextChannel) {
        this.channel = this.guild.translate('moderation/modlog:CHANNEL', {
            name: data.name,
            channel: `<#${data.id}>`
        });
        return this;
    }

    setReason(data: string) {
        this.reason = this.guild.translate('moderation/modlog:REASON', {
            reason: data
        });
        return this;
    }

    setExpiration(data: number) {
        this.expiration = data;
        return this;
    }

    get embed() {
        const embed = new MessageEmbed()
            .setColor(this._action.hex)
            .setURL(WEBSITE)
            .setDescription(`${this.action}\n${this.channel || this.user}\n${this.reason ||
                `**Reason:** Awaiting moderator's input. Use \`$reason ${this.id} <reason>\`.`}`)
            .setFooter(this.id, LINK.ICON)
            .setTimestamp();

        if (this.moderator)
            embed.setAuthor(this.moderator.display, this.moderator.icon);

        return embed;
    }

    async send() {
        const channel = await this.client.handlers.moderationLog.fetchChannel(this.guild);

        if (!channel) return;

        const latest = await this.client.handlers.moderationLog.fetchCase(this.guild, 'latest');

        if (!this.id) {
            let id = 1;

            // eslint-disable-next-line max-len
            if (latest?.embeds[0]?.footer?.text?.match(MODERATION_LOG_REGEX.CASE)) {
                // @ts-ignore
                id = Number(latest.embeds[0].footer.text.match(MODERATION_LOG_REGEX.CASE)[1]) + 1;
            }

            this.setId(id || 1);
        }

        await channel.send({ embeds: [this.embed] });

        return this.id;
    }
}
