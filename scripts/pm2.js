/* eslint-disable no-console */
import { connect, start, disconnect } from 'pm2';
import { Util } from 'discord.js';
import { token, clusterServer, clusterBuild } from '../config';

async function generateClusters() {
    const shardCount = await Util.fetchRecommendedShards(token);
    const shards = Array.from({ length: shardCount }, (a, b) => b);
    const clusterCount = Math.ceil(shardCount / 10);
    const clusters = [];

    for (let i = 1; i <= clusterCount; i + 1) {
        const clusterShards = shards.splice(0, 10);

        clusters.push({
            name: `${clusterServer}-${clusterBuild ? `${clusterBuild}-` : ''}${i}`,
            script: './index.js',
            autorestart: true,
            watch: false,
            env: {
                CLUSTER: `${clusterServer} ${clusterBuild ? `${clusterBuild} ` : ''}${i}`,
                CLUSTER_COUNT: clusterCount,
                SHARDS: clusterShards,
                SHARD_COUNT: clusterShards.length,
                TOTAL_SHARD_COUNT: shardCount,
            },
        });
    }

    return clusters;
}

connect(async (err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    const clusters = await generateClusters();

    console.log('Generating Clusters\n', clusters);

    clusters.forEach((cluster, i) => {
        start(cluster, (e) => {
            if (i === (clusters.length - 1)) {
                console.log('Generation Complete.\nExiting.');
                disconnect();
            }

            if (e) throw e;
        });
    });
});
