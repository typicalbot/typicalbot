import { MessageEmbed, Guild, User, TextChannel } from 'discord.js';
import Constants from '../utility/Constants';
import Cluster from '../index';
import { ModlogAction, GuildMessage } from '../types/typicalbot';

export default class ModerationLog {
    client: Cluster;
    guild: Guild;
    message: GuildMessage;
    id = '';
    _id = '';
    action = '';
    _action: ModlogAction = Constants.ModerationLogTypes.WARN;
    moderator = {
        display: `${this.message.author.tag} (${this.message.author.id})`,
        icon: this.message.author ? this.message.author.displayAvatarURL() : ''
    };
    user = '';
    channel = '';
    reason = '';
    expiration = 0;

    constructor(client: Cluster, message: GuildMessage, guild: Guild) {
        this.client = client;
        this.guild = guild;
        this.message = message;
    }

    setId(data: number) {
        this._id = data.toString();
        this.id = this.message.translate('modlog:CASE_ID', { id: data });
        return this;
    }

    setAction(data: ModlogAction) {
        this._action = data;
        const convertTime = this.client.functions.get('convertTime');
        this.action = this.message.translate('modlog:ACTION', {
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
                display: data.tag,
                icon: data.displayAvatarURL()
            };
        }

        return this;
    }

    setUser(data: User) {
        this.user = this.message.translate('modlog:USER', {
            tag: data.tag,
            id: data.id
        });
        return this;
    }

    setChannel(data: TextChannel) {
        this.channel = this.message.translate('modlog:CHANNEL', {
            name: data.name,
            channel: data.toString()
        });
        return this;
    }

    setReason(data: string) {
        this.reason = this.message.translate('modlog:REASON', { reason: data });
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

            this.setId(id);
        }

        channel.send(this.embed);

        return this.id;
    }
}
