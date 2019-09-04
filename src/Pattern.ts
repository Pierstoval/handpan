class Pattern<HandpanHit> {
    private readonly _hits: Array<HandpanHit> = [];
    private readonly _handpan_tune: HandpanTune;

    public readonly rhythm: number;

    constructor(rhythm: number, handpan_tune: HandpanTune) {
        this.rhythm = rhythm;
        this._handpan_tune = handpan_tune;
    }

    get handpan_tune(): HandpanTune {
        return this._handpan_tune;
    }

    get hits(): Array<HandpanHit> {
        return this._hits;
    }

    get count(): number {
        return this._hits.length;
    }

    public add(hit: HandpanHit): void {
        this._hits.push(hit);
    }

    public first(): HandpanHit | null {
        if (this._hits.length) {
            return this._hits[0];
        }

        return null;
    }

    public last(): HandpanHit | null {
        if (this._hits.length) {
            return this._hits[this._hits.length - 1];
        }

        return null;
    }

}
