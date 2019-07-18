
class App {
    private readonly document: HTMLDocument;
    private readonly patterns_container: HTMLElement;
    private readonly handpan_notes_input: HTMLInputElement;
    private readonly handpan_notes_result_element: HTMLElement;
    private readonly number_of_bars_input: HTMLInputElement;
    private readonly number_of_bars_result_element: HTMLElement;
    private readonly rhythm_inputs: NodeList;
    private readonly regenerate_button: HTMLElement;
    private readonly rhythm_input_to_enable: HTMLInputElement;

    private readonly handpan_tune = [
        // <0 => low notes below the handpan
        // 0 => ding
        // 1 => lowest note on the top-part of the handpan
        {"note": "C", "alter": "#", "octave": 3, "position": 0},
        {"note": "G", "alter": "#", "octave": 3, "position": 1},
        {"note": "A", "alter": "",  "octave": 4, "position": 2},
        {"note": "B", "alter": "",  "octave": 4, "position": 3},
        {"note": "C", "alter": "#", "octave": 4, "position": 4},
        {"note": "D", "alter": "#", "octave": 4, "position": 5},
        {"note": "E", "alter": "",  "octave": 4, "position": 6},
        {"note": "F", "alter": "#", "octave": 4, "position": 7},
        {"note": "G", "alter": "#", "octave": 4, "position": 8},
    ];

    private _running: boolean = false;

    constructor(
        document: HTMLDocument,
        patterns_container: HTMLElement,
        handpan_notes_input: HTMLInputElement,
        handpan_notes_result_element: HTMLElement,
        number_of_bars_input: HTMLInputElement,
        number_of_bars_result_element: HTMLElement,
        regenerate_button: HTMLElement,
        rhythm_inputs: NodeList,
        rhythm_input_to_enable: HTMLInputElement
    ) {
        this.document = document;
        this.patterns_container = patterns_container;
        this.handpan_notes_input = handpan_notes_input;
        this.handpan_notes_result_element = handpan_notes_result_element;
        this.number_of_bars_input = number_of_bars_input;
        this.number_of_bars_result_element = number_of_bars_result_element;
        this.rhythm_inputs = rhythm_inputs;
        this.regenerate_button = regenerate_button;
        this.rhythm_input_to_enable = rhythm_input_to_enable;
    }

    run() {
        if (this._running) {
            throw 'Application is already running.';
        }

        this._running = true;

        this.regenerate_button.addEventListener('click', () => this.update());

        // handpan_notes_result_element.value = 9;
        // handpan_notes_input.addEventListener('input', this.update);

        this.rhythm_input_to_enable.checked = true;
        this.rhythm_inputs.forEach((el) => el.addEventListener('change', () => this.update()));

        this.number_of_bars_input.value = '2';
        this.number_of_bars_input.addEventListener('input', () => this.update());

        this.update();
    }

    update() {
        // const handpan_notes = handpan_notes_input.value;
        const number_of_bars = Number(this.number_of_bars_input.value);
        const rhythm = this.getRadioButtonValue(this.rhythm_inputs);

        // handpan_notes_result_element.innerText = handpan_notes;
        this.number_of_bars_result_element.innerText = String(number_of_bars);

        this.patterns_container.setAttribute('data-rhythm', rhythm);
        this.patterns_container.innerHTML = '';

        let left_switch = false;

        let number_of_notes = number_of_bars * rhythm;

        for (let i = 0; i < number_of_notes; i++) {
            // Choose a "hit" type randomly in the list
            const handpan_hit = HitType.getRandomHitType();

            let pattern_item = this.createPatternItem(handpan_hit);

            this.patterns_container.appendChild(pattern_item);

            // Alternate left/right
            pattern_item.classList.add(left_switch ? 'hand-left' : 'hand-right');
            pattern_item.classList.add(handpan_hit.type);
            left_switch = !left_switch;

            // Add a separator to keep pattern a suite of 4 elements
            let needs_separator = i && (i + 1) % rhythm === 0 && (i + 1) < number_of_notes;

            if (needs_separator) {
                const pattern_item_separator = document.createElement('span');
                pattern_item_separator.className = 'pattern_time_separator';
                this.patterns_container.appendChild(pattern_item_separator);
            }
        }
    }

    private createPatternItem(handpan_hit) {
        const pattern_item = document.createElement('div');
        pattern_item.className = 'pattern_item';

        // Display handpan hit type
        const text_element = document.createElement('span');
        text_element.className = 'inner';
        text_element.innerText = handpan_hit.type;
        pattern_item.appendChild(text_element);

        // Handle potential notes to display if necessary
        if (handpan_hit.needs_notes) {
            const notes_element = document.createElement('div');
            notes_element.className = 'notes';

            // Choose as many random note in the list so we can display them as a helper
            const notes: Array<any> = [];

            for (let i = 0; i < handpan_hit.needs_notes; i++) {
                // Pick a random note
                const note = this.handpan_tune[Math.floor(Math.random() * this.handpan_tune.length)];
                let item_to_push = note.note + note.alter + note.octave;
                notes.push(item_to_push);
            }

            notes_element.innerHTML = notes.join('<br>');

            pattern_item.appendChild(notes_element);
        }

        return pattern_item;
    }

    private getRadioButtonValue(radios_list) {
        for (let item of radios_list) {
            if (item.checked) {
                return item.value;
            }
        }

        return null;
    }
}
