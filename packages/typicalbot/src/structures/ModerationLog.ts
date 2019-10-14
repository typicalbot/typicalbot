import { MessageEmbed, User, TextChannel } from 'discord.js';
import Constants from '../utility/Constants';
import Cluster from '../index';
import { ModlogAction } from '../types/typicalbot';
import { TypicalGuild } from '../extensions/TypicalGuild';

export default class ModerationLog {
    client: Cluster;
    guild: TypicalGuild;
    id = '';
    _id = '';
    action = '';
    _action: ModlogAction = Constants.ModerationLogTypes.WARN;
    moderator = {
        display: '',
        icon: ''
    };
    user = '';
    channel = '';
    reason = '';
    expiration = 0;

    constructor(client: Cluster, guild: TypicalGuild) {
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
        const convertTime = this.client.functions.get('convertTime');
        this.action = this.guild.translate('moderation/modlog:ACTION', {
            display: data.display,
            expiration: this.expiration
                ? ` (${convertTime && convertTime.execute(this.expiration)})`
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
            channel: data.toString()
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
            .setURL(Constants.Links.BASE)
            .setDescription(
                `${this.action}\n${this.channel || this.user}\n${this.reason ||
                    `**Reason:** Awaiting moderator's input. Use \`$reason ${this.id} <reason>\`.`}`
            )
            .setFooter(this.id, Constants.Links.ICON)
            .setTimestamp();

        if (this.moderator)
            embed.setAuthor(this.moderator.display, this.moderator.icon);

        return embed;
    }

    async send() {
        const channel = await this.client.handlers.moderationLog.fetchChannel(
            this.guild
        );

        const latest = await this.client.handlers.moderationLog.fetchCase(
            this.guild,
            'latest'
        );

        if (!this.id) {
            const id = latest
                ? Number(
                      latest.embeds[0] &&
                          latest.embeds[0].footer &&
                          latest.embeds[0].footer.text &&
                          latest.embeds[0].footer.text.match(
                              Constants.ModerationLogRegex.CASE
                          )
                  )
                : 1;

            this.setId(id || 1);
        }

        channel.send(this.embed);

        return this.id;
    }
}
