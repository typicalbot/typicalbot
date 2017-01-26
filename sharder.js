const cp            = require("child_process");
const config        = require("./config");

const SHARD_COUNT   = config.shards[config.bot];
const CLIENT_TOKEN  = config.tokens[config.bot];

const path          = `${__dirname}/Source/Client.js`;

const shards        = [];
const stats         = {};

const update = (shard, data) => {
    if (!stats[shard]) stats[shard] = {};
    Object.keys(data).map(key => stats[shard][key] = data[key]);
    transmit();
};

const send = data => shards.forEach(shard => shard.send(data));

const transmit = () => {
    const newdata = { "guilds": 0, "voiceConnections": 0, "heap": 0, "shards": stats };
    for (let shard in stats) Object.keys(stats[shard]).forEach(key => newdata[key] += Number(stats[shard][key]));
    send( { "type": "stats", "data": newdata } );
};

const create = SHARD_ID => {
    const shard = cp.fork( path, [], { env: { SHARD_ID, SHARD_COUNT, CLIENT_TOKEN } } );

    shards.push(shard);

    shard.on("message", message => {
        if (message.type === "stat") return update(SHARD_ID, message.data);
        if (message.type === "restartshard") return create(+message.data.shard);
        return send(message);
    });
};

for (let s = 0; s < SHARD_COUNT; s++) setTimeout(create, (6000 * s), s);
