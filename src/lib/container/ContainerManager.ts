import Container from './Container';

class ContainerManager {
    private readonly containers: Map<string, any>;

    constructor() {
        this.containers = new Map<string, any>();
    }

    has(alias: string) {
        return this.containers.has(alias);
    }

    get(alias: string) {
        if (!this.containers.has(alias)) {
            return null;
        }

        const { container } = this.containers.get(alias)!;

        return container;
    }

    create(alias: string, clazz: any) {
        this.containers.set(alias, new Container(clazz));

        return this;
    }
}

export default ContainerManager;
