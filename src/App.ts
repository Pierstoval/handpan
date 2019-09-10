
class App {
    private readonly window: Window;
    private readonly document: HTMLDocument;
    private readonly patterns_container: HTMLElement;
    private readonly number_of_bars_input: HTMLInputElement;
    private readonly number_of_bars_result_element: HTMLElement;
    private readonly rhythm_inputs: NodeList;
    private readonly regenerate_button: HTMLElement;
    private readonly rhythm_input_to_enable: HTMLInputElement;

    private readonly handpan_tune = new HandpanTune();

    private _running: boolean = false;

    private _currentPattern: Pattern;
    private _patternRenderer: PatternRenderer;

    constructor() {
        this.window = window;
        this.document = window.document;

        const patterns_container = this.document.getElementById('pattern');
        if (!(patterns_container instanceof HTMLElement)) {
            throw App.invalidTypeMessage('patterns_container', 'HTMLElement', typeof patterns_container);
        }

        const number_of_bars_input = this.document.getElementById('pattern_bars');
        if (!(number_of_bars_input instanceof HTMLInputElement)) {
            throw App.invalidTypeMessage('number_of_bars_input', 'HTMLInputElement', typeof number_of_bars_input);
        }

        const number_of_bars_result_element = this.document.getElementById('pattern_bars_result');
        if (!(number_of_bars_result_element instanceof HTMLElement)) {
            throw App.invalidTypeMessage('number_of_bars_result_element', 'var_type', typeof number_of_bars_result_element);
        }

        const regenerate_button = this.document.getElementById('regenerate_button');
        if (!(regenerate_button instanceof HTMLElement)) {
            throw App.invalidTypeMessage('regenerate_button', 'HTMLElement', typeof regenerate_button);
        }

        const rhythm_inputs = this.document.querySelectorAll('input[name="rhythm"]');
        if (!(rhythm_inputs instanceof NodeList)) {
            throw App.invalidTypeMessage('rhythm_inputs', 'NodeList', typeof rhythm_inputs);
        }

        const rhythm_input_to_enable = rhythm_inputs[1] || rhythm_inputs[0];
        if (!(rhythm_input_to_enable instanceof HTMLInputElement)) {
            throw App.invalidTypeMessage('rhythm_input_to_enable', 'HTMLInputElement', typeof rhythm_input_to_enable);
        }

        this.patterns_container = patterns_container;
        this.number_of_bars_input = number_of_bars_input;
        this.number_of_bars_result_element = number_of_bars_result_element;
        this.regenerate_button = regenerate_button;
        this.rhythm_inputs = rhythm_inputs;
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

        this.rhythm_input_to_enable.checked = true;

        this.number_of_bars_input.value = '2';

        this.refreshRandomPattern();
    }

    refreshRandomPattern(): void {
        const number_of_bars = Number(this.number_of_bars_input.value);
        const rhythm = parseInt(App.getRadioButtonValue(this.rhythm_inputs), 10);

        this.number_of_bars_result_element.innerText = String(number_of_bars);

        this.patterns_container.setAttribute('data-rhythm', rhythm.toString());
        this.patterns_container.innerHTML = '';

        let number_of_notes = number_of_bars * rhythm;

        this._currentPattern = new Pattern(rhythm, this.handpan_tune);

        for (let i = 0; i < number_of_notes; i++) {
            // Choose a "hit" type randomly in the list
            const handpan_hit = HandpanHit.createRandomHit(this._currentPattern);

            this._currentPattern.add(handpan_hit);
        }

        this._patternRenderer.renderPattern(this._currentPattern);

        console.info('Pattern:', this._currentPattern);
    }

    private static getRadioButtonValue(radios_list: NodeList): string {
        let value = '';

        radios_list.forEach(function (item: Node) {
            if (!(item instanceof HTMLInputElement)) {
                return;
            }

            if (item.checked) {
                value = item.value;
            }
        });

        return value;
    }

    private static invalidTypeMessage(var_name: string, type: string, current_type: string) {
        return 'Variable '+var_name+' was expected to be a '+type+', '+current_type+' given';
    }
}
