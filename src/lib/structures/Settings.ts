export default (id: string) => ({
    id,
    language: 'en-US',
    dm: {
        commands: false
    },
    embed: true,
    roles: {
        administrator: [],
        moderator: [],
        blacklist: [],
        public: [],
        mute: null
    },
    ignored: {
        commands: [],
        invites: [],
        stars: []
    },
    announcements: {
        id: null,
        mention: null
    },
    aliases: [],
    logs: {
        id: null,
        join: null,
        leave: null,
        ban: null,
        unban: null,
        nickname: null,
        invite: null,
        moderation: null,
        purge: null,
        say: null,
        slowmode: null
    },
    auto: {
        role: {
            bots: null,
            id: null,
            delay: null,
            silent: true
        },
        message: null,
        nickname: null
    },
    mode: 'free',
    prefix: {
        custom: null,
        default: true
    },
    automod: {
        spam: {
            mentions: {
                enabled: false,
                severity: 3
            },
            caps: {
                enabled: false,
                severity: 7
            },
            zalgo: {
                enabled: false,
                severity: 7
            },
            scamlinks: {
                enabled: false
            }
        },
        invite: false,
        inviteaction: false,
        invitewarn: 1,
        invitekick: 3
    },
    nonickname: true,
    subscriber: null,
    starboard: {
        id: null,
        count: 5
    },
    pcs: [],
    webhooks: {
        twitch: {
            id: null,
            message: null
        }
    }
});
