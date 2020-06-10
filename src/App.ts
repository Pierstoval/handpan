
import AppDisplay from "./AppDisplay";
import HandpanTune from "./HandpanTune";
import HandpanTuneRenderer from "./HandpanTuneRenderer";

export default class App {
    private readonly window: Window;
    private readonly document: HTMLDocument;
    private readonly containerName: string;
    private display: AppDisplay|null = null;
    private handpan_tune: HandpanTune;

    constructor(containerName: string, window: Window) {
        this.containerName = containerName;
        this.window = window;
        this.document = window.document;

        let container = this.document.getElementById(this.containerName);

        if (!container) {
            throw new Error(`Container "${container}" does not exist in the DOM.`);
        }

        this.display = new AppDisplay(this.document, container);
        this.handpan_tune = new HandpanTune(new HandpanTuneRenderer(this.document, this.display.handpan_tune));

        this.render();
    }

    private render() {
        this.handpan_tune.render();
    }
}
