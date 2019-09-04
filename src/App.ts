
class App {
    private readonly window: Window;
    private readonly document: HTMLDocument;
    private readonly patterns_container: HTMLElement;
    private readonly handpan_notes_input: HTMLInputElement;
    private readonly handpan_notes_result_element: HTMLElement;
    private readonly number_of_bars_input: HTMLInputElement;
    private readonly number_of_bars_result_element: HTMLElement;
    private readonly rhythm_inputs: NodeList;
    private readonly regenerate_button: HTMLElement;
    private readonly rhythm_input_to_enable: HTMLInputElement;

    private readonly handpan_tune = new HandpanTune();

    private _running: boolean = false;

    private _currentPattern: Pattern<HandpanHit>;
    private _patternRenderer: PatternRenderer;

    constructor(
        window: Window,
        patterns_container: HTMLElement,
        handpan_notes_input: HTMLInputElement,
        handpan_notes_result_element: HTMLElement,
        number_of_bars_input: HTMLInputElement,
        number_of_bars_result_element: HTMLElement,
        regenerate_button: HTMLElement,
        rhythm_inputs: NodeList,
        rhythm_input_to_enable: HTMLInputElement
    ) {

        this.window = window;
        this.document = window.document;
        this.patterns_container = patterns_container;
        this.handpan_notes_input = handpan_notes_input;
        this.handpan_notes_result_element = handpan_notes_result_element;
        this.number_of_bars_input = number_of_bars_input;
        this.number_of_bars_result_element = number_of_bars_result_element;
        this.rhythm_inputs = rhythm_inputs;
        this.regenerate_button = regenerate_button;
        this.rhythm_input_to_enable = rhythm_input_to_enable;

        this._currentPattern = new Pattern(0, this.handpan_tune);
        this._patternRenderer = new PatternRenderer(this.document, this.patterns_container);
    }

    run(): void {
        if (this._running) {
            throw 'Application is already running.';
        }

        this._running = true;

        this.regenerate_button.addEventListener('click', () => this.refreshRandomPattern());

        // handpan_notes_result_element.value = 9;
        // handpan_notes_input.addEventListener('input', this.refreshRandomPattern);

        this.rhythm_input_to_enable.checked = true;

        this.number_of_bars_input.value = '2';

        this.refreshRandomPattern();
    }

    refreshRandomPattern(): void {
        // const handpan_notes = handpan_notes_input.value;
        const number_of_bars = Number(this.number_of_bars_input.value);
        const rhythm = App.getRadioButtonValue(this.rhythm_inputs);

        // handpan_notes_result_element.innerText = handpan_notes;
        this.number_of_bars_result_element.innerText = String(number_of_bars);

        this.patterns_container.setAttribute('data-rhythm', rhythm);
        this.patterns_container.innerHTML = '';

        let number_of_notes = number_of_bars * rhythm;

        this._currentPattern = new Pattern<HandpanHit>(rhythm, this.handpan_tune);

        for (let i = 0; i < number_of_notes; i++) {
            // Choose a "hit" type randomly in the list
            const handpan_hit = HandpanHit.createRandomHit(this._currentPattern);

            this._currentPattern.add(handpan_hit);
        }

        this._patternRenderer.renderPattern(this._currentPattern);

        console.info('Pattern:', this._currentPattern);
    }

    private static getRadioButtonValue(radios_list) {
        for (let item of radios_list) {
            if (item.checked) {
                return item.value;
            }
        }

        return null;
    }
}
