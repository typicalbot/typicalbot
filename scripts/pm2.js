const pm2 = require("pm2");
const { Util } = require("discord.js");
const config = require("../config");

async function generateClusters() {
    const shardCount = await Util.fetchRecommendedShards(config.token);
    const shards = Array.from({ length: shardCount }, (a, b) => b);
    const clusterCount = Math.ceil(shardCount / 10);
    const clusters = new Array();

    for (let i = 1; i <= clusterCount; i++) {
        const clusterShards = shards.splice(0, 10);

        clusters.push({
            name: `${config.clusterServer}-${config.clusterBuild ? `${config.clusterBuild}-` : ""}${i}`,
            script: './index.js',
            autorestart: true,
            watch: false,
            env: {
                CLUSTER: `${config.clusterServer} ${config.clusterBuild ? `${config.clusterBuild} ` : ""}${i}`,
                CLUSTER_COUNT: clusterCount,
                SHARDS: clusterShards,
                SHARD_COUNT: clusterShards.length,
                TOTAL_SHARD_COUNT: shardCount
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

    const clusters = await generateClusters();

    console.log("Generating Clusters\n", clusters);
    
    clusters.forEach((cluster, i) => {
        pm2.start(cluster, function (err, apps) {
            if (i === (clusters.length -1)) {
                console.log("Generation Complete.\nExiting.");
                pm2.disconnect();
            }

            if (err) throw err;
        });
    });
});