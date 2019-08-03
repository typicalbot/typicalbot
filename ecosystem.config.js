const { Util } = require("discord.js");
const config = require("./config");

function generateClusters() {
    return new Promise((resolve, reject) => {
        Util.fetchRecommendedShards(config.token).then(shardCount => {
            const shards = Array.from({ length: shardCount }, (a, b) => b);
            const clusterCount = Math.ceil(shardCount / config.shardsPerCluster);
            const clusters = new Array();

            for (let i = 1; i <= clusterCount; i++) {
                const clusterShards = shards.splice(0, config.shardsPerCluster);

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
                })
            }

            resolve(clusters);
        });
    })
}

module.exports = generateClusters();