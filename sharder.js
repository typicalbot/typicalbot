const child_process = require("child_process");

const file          = `${__dirname}/Source/Client.js`;
const shards        = [];
const data          = {};
const shardCount    = 1;

function changeData(shard, sentData) {
    if (!data[shard]) data[shard] = {};
    Object.keys(sentData).map(key => data[shard][key] = sentData[key]);
    sendData();
}

function createShard(shardNumber) {
    const shard = child_process.fork(file, [], {env: {"SHARD_ID": shardNumber, "SHARD_COUNT": shardCount}});
    shards.push(shard);

    shard.on("message", message => {
        if (message.type === "stat") {
            changeData(shardNumber, message.data);
        } else if (message.type === "reload") {
            send({"type": "reload", "module": message.module});
        }
    });
}

function send(data) {
    shards.map(shard => shard.send(data));
}

function sendData() {
    const globalData = {"guilds": 0, "voiceConnections": 0, "heap": 0, "shards": data};
    for (let shard in data) {
        Object.keys(data[shard]).map(key => globalData[key] += Number(data[shard][key]));
    }
    send({"type": "stats", "data": globalData});
}

for (let s = 0; s < shardCount; s++) setTimeout(createShard, (6000 * s), s);
