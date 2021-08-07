class Container {
    private readonly clazz: any;

    constructor(clazz: any) {
        this.clazz = clazz;
    }

    get container() {
        return this.clazz;
    }
}

export default Container;
