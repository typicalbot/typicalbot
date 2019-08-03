const pm2 = require("pm2");
const { Util } = require("discord.js");
const config = require("../config");

async function generateClusters() {
    const shardCount = await Util.fetchRecommendedShards(config.token);
    const shards = Array.from({ length: shardCount }, (a, b) => b);
    const clusterCount = Math.ceil(shardCount / config.shardsPerCluster);
    const clusters = new Array();

    console.log(shardCount, shards, clusterCount);

    for (let i = 1; i <= clusterCount; i++) {
        const clusterShards = shards.splice(0, config.shardsPerCluster);

        console.log(clusterShards);

        clusters.push({
            name: `${config.clusterServer}-${config.clusterBuild ? `${config.clusterBuild}-` : ""}${i}`,
            script: './index.js',
            autorestart: false,
            watch: false,
            env: {
                CLUSTER: `${config.clusterServer} ${config.clusterBuild ? `${config.clusterBuild} ` : ""}${i}`,
                //SHARDS: `${clusterShards[0]}-${clusterShards[9] || clusterShards[clusterShards.length]}`
                SHARDS: clusterShards
            }
        });
    }

    return clusters;
}

pm2.connect(async err => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    console.log("Yay!");

    const clusters = await generateClusters();

    console.log(clusters);
    
    clusters.forEach((cluster, i) => {
        pm2.start(cluster, function (err, apps) {
            if (i === (clusters.length -1)) pm2.disconnect();

            if (err) throw err;
        });
    });
});