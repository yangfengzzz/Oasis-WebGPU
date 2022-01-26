/**
 * Class pool utils.
 */
export class ClassPool<T> {
    private _elementPoolIndex: number = 0;
    private _elementPool: T[] = [];
    private _type: new () => T;

    constructor(type: new () => T) {
        this._type = type;
    }

    /**
     * Get element from pool.
     */
    getFromPool(): T {
        const {_elementPoolIndex: index, _elementPool: pool} = this;
        this._elementPoolIndex++;
        if (pool.length === index) {
            const element = new this._type();
            pool.push(element);
            return element;
        } else {
            return pool[index];
        }
    }

    /**
     * Reset pool.
     */
    resetPool(): void {
        this._elementPoolIndex = 0;
    }
}
