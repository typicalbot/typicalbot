const child_process = require("child_process");

const file          = `${__dirname}/Source/source.js`;
const shards        = [];
const data          = {};
const shardCount    = 12;

const TRACE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4MTUzZWJkZjI1Y2Y3MDAwMTZmOTRiMiIsImlhdCI6MTQ3Nzc4NzMyNX0.F7o_291W4VJ9rUI3GqcOne-dEjbq9j5KG8utZpjQyNs";

function changeData(shard, sentData) {
    if (!data[shard]) data[shard] = {};
    Object.keys(sentData).map(key => data[shard][key] = sentData[key]);
    sendData();
}

function createShard(shardNumber) {
    console.log(`CREATING SHARD: ${shardNumber}`);
    const TRACE_SERVICE_NAME = `TypicalBot-Shard${shardNumber}`;
    const shard = child_process.fork(file, [], {env: {"SHARD_ID": shardNumber, "SHARD_COUNT": shardCount, TRACE_API_KEY, TRACE_SERVICE_NAME}});
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
    const globalData = {"guilds": 0, "voiceConnections": 0, "shards": data};
    for (let shard in data) {
        Object.keys(data[shard]).map(key => globalData[key] += Number(data[shard][key]));
    }
    send({"type": "stats", "data": globalData});
}

for (let s = 0; s < shardCount; s++) setTimeout(createShard, (6000 * s), s);
