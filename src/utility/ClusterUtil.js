exports.NodeClusterUtil = class NodeClusterUtil {
    constructor(client) {
        this.client = client;
    }

    fetchData(stat) {
        return this.client.node.sendTo("manager", {
            event: "collectData",
            data: property
        }, { receptive: true });
    }
}

exports.StandaloneClusterUtil = class StandaloneClusterUtil {
    constructor(client) {
        this.client = client;
    }

    fetchData(stat) {
        return eval(`this.client.${stat}`);
    }
}