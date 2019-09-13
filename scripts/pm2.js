require('dotenv').config();
const pm2 = require("pm2");
const { Util } = require("discord.js");

async function generateClusters() {
    const shardCount = await Util.fetchRecommendedShards(process.env.TOKEN);
    const shards = Array.from({ length: shardCount }, (a, b) => b);
    const clusterCount = Math.ceil(shardCount / 10);
    const clusters = [];

    for (let i = 1; i <= clusterCount; i + 1) {
        const clusterShards = shards.splice(0, 10);

        clusters.push({
            name: `${process.env.CLUSTER_NAME}-${process.env.CLUSTER_BUILD ? `${process.env.CLUSTER_BUILD}-` : ""}${i}`,
            script: './index.js',
            autorestart: true,
            watch: false,
            env: {
                CLUSTER: `${process.env.CLUSTER_NAME} ${process.env.CLUSTER_BUILD ? `${process.env.CLUSTER_BUILD} ` : ""}${i}`,
                CLUSTER_COUNT: clusterCount,
                SHARDS: clusterShards,
                SHARD_COUNT: clusterShards.length,
                TOTAL_SHARD_COUNT: shardCount,
            },
        });
    }

    return clusters;
}

pm2.connect(async (err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    const clusters = await generateClusters();

    console.log('Generating Clusters\n', clusters);

    clusters.forEach((cluster, i) => {
        pm2.start(cluster, (e) => {
            if (i === (clusters.length - 1)) {
                console.log('Generation Complete.\nExiting.');
                pm2.disconnect();
            }

            if (e) throw e;
        });
    });
});
