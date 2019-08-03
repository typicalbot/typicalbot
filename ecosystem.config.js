module.exports = {
    apps: [{
        name: 'Primula-PTB-1',
        script: 'cluster/index.js',

        autorestart: false,
        watch: false,
        env: {
            CLUSTER: "Primula PTB 1",
            SHARDS: '1-2'
        }
    },
    {
        name: 'Primula-PTB-2',
        script: 'cluster/index.js',

        autorestart: false,
        watch: false,
        env: {
            CLUSTER: "Primula PTB 2",
            SHARDS: '3-4'
        }
    }]
};
