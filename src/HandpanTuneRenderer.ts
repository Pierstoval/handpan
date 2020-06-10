import HandpanTune from "./HandpanTune";
import MusicNote from "./MusicNote";

export default class HandpanTuneRenderer {
    private document: HTMLDocument;
    private container: HTMLDivElement;

    constructor(document: HTMLDocument, container: HTMLDivElement) {
        this.document = document;
        this.container = container;

        const _this = this;

        this.container.addEventListener('click', function (event) {
            _this.interact(event);
        });
    }

    public render(tune: HandpanTune): void {
        console.info('Rendering handpan tune.');
        this.container.innerHTML = '';

        this.renderDings(tune.notes.filter((note) => note.ding));
        this.renderTopNotes(tune.notes.filter((note) => !note.ding && note.position >= 0));
        this.renderBottomNotes(tune.notes.filter((note) => !note.ding && note.position < 0));
    }

    private interact(event: MouseEvent): void {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            console.error('Did not touch an HTML element.');

            return;
        }

        console.info('Clicked!', target);
    }

    private renderDings(notes: MusicNote[]) {
        const numberOfDings = notes.length;
        let countDings = 0;

        for (const note of notes) {
            const el = this.document.createElement('span');
            el.innerHTML = note.note+note.alteration+note.octave;
            el.classList.add('handpan_note');
            el.classList.add('ding');

            const angle = Math.floor((360 / numberOfDings) * countDings);

            countDings++;

            if (numberOfDings > 1) {
                // If more than one dings, let's rotate them in the middle.
                // Else, it'll be in the middle automatically
                el.style.transform = `rotate(${angle}deg) translate(-40px) rotate(-${angle}deg)`;
            }

            const size = 40 + (10 / countDings);
            const colorHue = 255;
            HandpanTuneRenderer.addStyleToNoteElement(el, note, colorHue, countDings, numberOfDings, size);

            this.container.appendChild(el);
        }
    }

    private renderTopNotes(notes: MusicNote[]) {
        const numberOfNotes = notes.length;

        let notesCounter = 0;

        const angleOffset = -90; // Starts at the bottom side instead of the left.
        const angleIncrementation = 360 / numberOfNotes;

        let angle = 0;

        for (const note of notes) {
            if (notesCounter && notesCounter % 2 === 0) {
                angle *= -1;
            } else {
                angle += (angleIncrementation * notesCounter);
            }

            const noteAngle = angle + angleOffset;

            notesCounter++;

            const transformString = `rotate(${noteAngle}deg) translate(-140px) rotate(${-1 * (noteAngle)}deg)`;
            const size = 50 + (30 / notesCounter);
            const colorHue = 10;

            const el = this.document.createElement('span');
            el.style.transform = transformString;
            HandpanTuneRenderer.addStyleToNoteElement(el, note, colorHue, notesCounter, numberOfNotes, size);

            this.container.appendChild(el);
        }
    }

    private static addStyleToNoteElement(el: HTMLSpanElement, note: MusicNote, colorHue: number, notesCounter: number, numberOfNotes: number, size: number): void {
        el.classList.add('handpan_note');
        el.innerHTML = note.note + note.alteration + note.octave;
        el.style.backgroundColor = `hsl(${colorHue}, 10%, ${Math.floor(30 + 20 * notesCounter / numberOfNotes)}%)`;
        el.style.height = size + 'px';
        el.style.lineHeight = size + 'px';
        el.style.margin = (-4 - (size / 2)) + 'px';
        el.style.width = size + 'px';
    }

    private renderBottomNotes(notes: MusicNote[]) {
        const numberOfNotes = notes.length;

        let notesCounter = 0;

        const angleOffset = numberOfNotes === 2 ? 0 : 135; // Starts at the bottom side instead of the left.
        const angleIncrementation = - 360 / numberOfNotes;

        let angle = 0;

        for (const note of notes) {
            if (notesCounter && notesCounter % 2 === 0) {
                angle *= -1;
            } else {
                angle += (angleIncrementation * notesCounter);
            }

            const noteAngle = angle + angleOffset;

            notesCounter++;

            const transformString = `rotate(${noteAngle}deg) translate(-250px) rotate(${-1 * (noteAngle)}deg)`;
            const size = 60 + (20 / notesCounter);
            const colorHue = 20;

            const el = this.document.createElement('span');
            el.classList.add('bottom_note');
            el.style.transform = transformString;
            HandpanTuneRenderer.addStyleToNoteElement(el, note, colorHue, notesCounter, numberOfNotes, size);

            this.container.appendChild(el);
        }
    }
}
