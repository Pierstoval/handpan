import AppDisplay from "./AppDisplay";
import HandpanTune from "./HandpanTune";

export default class HandpanTuneRenderer {
    private document: HTMLDocument;
    private container: HTMLDivElement;

    constructor(document: HTMLDocument, container: HTMLDivElement) {
        this.document = document;
        this.container = container;

        const _this = this;

        this.container.addEventListener('click', function(event) {
            _this.interact(event);
        });
    }

    public render(tune: HandpanTune): void {
        console.info('Rendering handpan tune.');
        this.container.innerHTML = '';

        const numberOfDings = tune.numberOfDings();
        const numberOfNotes = tune.notes.length - numberOfDings;
        let countDings = 0;
        let countNotes = 0;

        for (const note of tune.notes) {
            const el = this.document.createElement('span');
            el.innerHTML = note.note+note.alteration+note.octave;

            el.classList.add('handpan_note');

            if (note.position <= 0) {
                // Ding
                el.classList.add('ding');

                const angle = Math.floor((360 / numberOfNotes) * countDings);
                if (numberOfDings > 1) {
                    // If more than one dings, let's rotate them in the middle.
                    // Else, it'll be in the middle automatically
                    el.style.transform = `rotate(${angle}deg) translate(-40px) rotate(-${angle}deg)`;
                }

                countDings++;
            } else {
                // Standard note
                const angle = Math.floor((360 / numberOfNotes) * countNotes);
                el.style.transform = `rotate(${angle}deg) translate(-140px) rotate(-${angle}deg)`;

                countNotes++;
            }

            this.container.appendChild(el);
        }
    }

    private interact(event: MouseEvent): void {
        console.info('Clicked!', event);
    }
}
