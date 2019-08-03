module.exports = {
    apps: [{
        name: 'TypicalBot-PTB-Cluster-1',
        script: 'cluster/index.js',

        autorestart: false,
        watch: false,
        env: {
            CLUSTER: "TypicalBot PTB - Cluster t1",
            SHARDS: '1-2'
        }
    },
    {
        name: 'TypicalBot-PTB-Cluster-2',
        script: 'cluster/index.js',

        autorestart: false,
        watch: false,
        env: {
            CLUSTER: "TypicalBot PTB - Cluster t2",
            SHARDS: '3-4'
        }
    }]
};
