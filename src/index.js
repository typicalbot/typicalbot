require('./utility/Extenders');

const { Client, Collection } = require('discord.js');
const fetch = require('node-fetch');

const config = require('../config.json');

const DatabaseHandler = require('./handlers/Database');
const TaskHandler = require('./handlers/Tasks');
const PermissionsHandler = require('./handlers/Permissions');
const ModerationLogHandler = require('./handlers/ModerationLog');
const MusicHandler = require('./handlers/Music');

const SettingHandler = require('./handlers/Settings');
const FunctionHandler = require('./handlers/Functions');
const CommandHandler = require('./handlers/Commands');
const EventHandler = require('./handlers/Events');

const MusicUtility = require('./utility/Music');

module.exports = class Cluster extends Client {
    constructor(node) {
        super({
            messageCacheMaxSize: 150,
            messageCacheLifetime: 1800,
            messageSweepInterval: 300,
            disableEveryone: true,
            disabledEvents: ['TYPING_START', 'CHANNEL_PINS_UPDATE'],
            partials: ['MESSAGE'],
        });

        this.node = node;
        this.config = config;
        this.build = config.build;

        this.shards = JSON.parse(process.env.SHARDS);
        this.cluster = `${process.env.CLUSTER} [${this.shards.join(',')}]`;
        this.shardCount = process.env.TOTAL_SHARD_COUNT;

        this.handlers = {};
        this.handlers.database = new DatabaseHandler(this);
        this.handlers.tasks = new TaskHandler(this);
        this.handlers.permissions = new PermissionsHandler(this);
        this.handlers.moderationLog = new ModerationLogHandler(this);
        this.handlers.music = new MusicHandler(this);

        this.settings = new SettingHandler(this);
        this.functions = new FunctionHandler(this);
        this.commands = new CommandHandler(this);
        this.events = new EventHandler(this);

        this.utility = {};
        this.utility.music = new MusicUtility(this);

        this.caches = {};
        this.caches.donors = new Collection();
        this.caches.bans = new Collection();
        this.caches.unbans = new Collection();
        this.caches.softbans = new Collection();
        this.caches.invites = new Collection();

        this.fetchDonors();

        // i18n translation method
        this.translate = await i18n();

        this.login(this.config.token);
    }

    fetchData(property) {
        return this.node.sendTo('manager', {
            event: 'collectData',
            data: property,
        }, { receptive: true });
    }

    async fetchDonors() {
        (await this.handlers.database.connection.table('donors')).forEach((e) => {
            if (e.id.length > 5) this.caches.donors.set(e.id, e);
        });

        return this.caches.donors;
    }

    get usedRAM() {
        return Math.round(process.memoryUsage().heapUsed / 1048576);
    }

    get totalRAM() {
        return Math.round(process.memoryUsage().heapTotal / 1048576);
    }

    async sendStatistics(shardID) {
        fetch('https://www.carbonitex.net/discord/data/botdata.php', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shardid: shardID,
                shardcount: this.shardCount.toString(),
                servercount: this.guilds.filter((g) => g.shardID === shardID).size.toString(),
                key: this.config.apis.carbon,
            }),
        }).catch((err) => {
            if (err) console.error(`Carbonitex Stats Transfer Failed ${err}`);
        });

        fetch(`https://discordbots.org/api/bots/${this.user.id}/stats`, {
            method: 'post',
            headers: {
                Authorization: this.config.apis.discordbots,
            },
            body: JSON.stringify({
                shard_id: shardID,
                shard_count: this.shardCount.toString(),
                server_count: this.guilds.filter((g) => g.shardID === shardID).size.toString(),
            }),
        }).catch((err) => {
            if (err) console.error(`DiscordBots Stats Transfer Failed ${err}`);
        });
    }
};
