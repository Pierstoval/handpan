const HANDPAN_TUNE_ID = 'handpan_tune';

export default class AppDisplay {
    private readonly document: HTMLDocument;
    private readonly container: HTMLElement;
    private readonly prefix: string;

    public readonly handpan_tune: HTMLDivElement;

    constructor(document: HTMLDocument, container: HTMLElement) {
        this.document = document;
        this.container = container;
        if (!container.id) {
            throw new Error('Display container must have an "id" HTML attribute.');
        }
        this.prefix = container.id+'_';

        this.handpan_tune = this.createHandpanTuneElement();
    }

    private createHandpanTuneElement(): HTMLDivElement {
        const el = this.document.createElement('div');
        el.id = this.prefix+HANDPAN_TUNE_ID;

        this.container.appendChild(el);

        return el;
    }
}
