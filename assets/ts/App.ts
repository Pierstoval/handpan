import Renderer from "./Renderer";

export default class App {
    private readonly window: Window;
    private readonly document: HTMLDocument;

    private _running: boolean = false;

    private container: HTMLElement;
    private renderer: Renderer;

    constructor(containerName: string) {
        this.window = window;
        this.document = window.document;
        let container = document.getElementById(containerName);
        if (!container) {
            throw new Error(`Container "${container}" does not exist in the DOM.`);
        }
        this.container = container;
        this.renderer = new Renderer();
    }

    run(): void {
        if (this._running) {
            throw 'Application is already running.';
        }
        this._running = true;

        this.showInputs();
    }

    private showInputs(): void {

        this.renderer.render();
    }
}
