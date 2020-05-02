import Pattern from "./Pattern";
import HandpanHit from "./HandpanHit";

export default class PatternRenderer {
    private document: HTMLDocument;
    private container: HTMLElement;

    constructor(document: HTMLDocument, container: HTMLElement) {
        this.document = document;
        this.container = container;
    }

    public renderPattern(pattern: Pattern): void {
        let number_of_notes = pattern.count;

        let i = 0;

        for (let handpan_hit of pattern.hits) {
            let pattern_item = PatternRenderer.createPatternItem(pattern, handpan_hit);

            this.container.appendChild(pattern_item);

            // Alternate left/right
            pattern_item.classList.add(handpan_hit.hand === Hand.left ? 'hand-left' : 'hand-right');
            pattern_item.classList.add(handpan_hit.hit_type.name);

            // Add a separator to keep pattern a suite of 4 elements
            let needs_separator = i && (i + 1) % pattern.rhythm === 0 && (i + 1) < number_of_notes;

            if (needs_separator) {
                const pattern_item_separator = document.createElement('span');
                pattern_item_separator.className = 'pattern_time_separator';
                this.container.appendChild(pattern_item_separator);
            }

            i++;
        }
    }

    private static createPatternItem(pattern: Pattern, handpan_hit: HandpanHit): HTMLElement {
        const pattern_item = document.createElement('div');
        pattern_item.className = 'pattern_item';

        // Display handpan hit type
        const text_element = document.createElement('span');
        text_element.className = 'inner';
        text_element.innerText = handpan_hit.hit_type.name;
        pattern_item.appendChild(text_element);

        // Handle potential notes to display if necessary
        if (handpan_hit.hit_type.needs_notes) {
            const notes_element = document.createElement('div');
            notes_element.className = 'notes';

            // Choose as many random note in the list so we can display them as a helper
            const notes: Array<any> = [];

            for (let i = 0; i < handpan_hit.hit_type.needs_notes; i++) {
                // Pick a random note
                const note = pattern.handpan_tune.getRandomNote();
                let item_to_push = note.note + note.alteration + note.octave;
                notes.push(item_to_push);
            }

            notes_element.innerHTML = notes.join('<br>');

            pattern_item.appendChild(notes_element);
        }

        return pattern_item;
    }
}
